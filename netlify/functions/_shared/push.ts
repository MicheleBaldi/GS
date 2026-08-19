const { google } = require('googleapis');
import webpush from 'web-push';

const { JSONKEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
const SPREADSHEET_ID = '10km3Xk8paNpDjUAXkaAHyib8C1QjZGzNA9a5XzvVdvU';
const SHEET_NAME = 'Notifiche';
const SHEET_RANGE = `${SHEET_NAME}!A:D`;

// Must match src/environments/environment.ts vapidPublicKey (pair of VAPID_PRIVATE_KEY).
const DEFAULT_PUBLIC = 'BCxbVn1MCL9HfXhC7eCQPA5P8fodz2918RzSPRNVUAF8AWSndD1LtKg7wDvBYTDIUOaud5S4k4NQgvhZqcdDWIw';

type PushSub = {
	endpoint: string;
	keys: { p256dh: string; auth: string };
	personaId: string;
};

async function authSheets() {
	const credentials = JSON.parse(JSONKEY!);
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const authClient = await auth.getClient();
	return google.sheets({ version: 'v4', auth: authClient });
}

async function loadSubscriptions(): Promise<PushSub[]> {
	const sheets = await authSheets();
	const result = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: SHEET_RANGE,
	});
	const rows: any[][] = result.data.values || [];

	return rows
		.slice(1)
		.map((row) => {
			const endpoint = String(row[0] || '').trim();
			const personaId = String(row[1] || '').trim();
			const p256dh = String(row[2] || '').trim();
			const auth = String(row[3] || '').trim();
			if (!endpoint || !p256dh || !auth) {
				return null;
			}
			return {
				endpoint,
				keys: { p256dh, auth },
				personaId,
			};
		})
		.filter(Boolean) as PushSub[];
}

function vapidDebugMeta() {
	const publicUsed = VAPID_PUBLIC_KEY || DEFAULT_PUBLIC;
	return {
		hasEnvPublic: Boolean(VAPID_PUBLIC_KEY),
		hasEnvPrivate: Boolean(VAPID_PRIVATE_KEY),
		publicPrefix: String(publicUsed).slice(0, 12),
		publicLen: String(publicUsed).length,
		privateLen: VAPID_PRIVATE_KEY ? String(VAPID_PRIVATE_KEY).length : 0,
		usedDefaultPublic: !VAPID_PUBLIC_KEY,
	};
}

function ensureVapid() {
	if (!VAPID_PRIVATE_KEY) {
		throw new Error('VAPID_PRIVATE_KEY non configurata');
	}
	webpush.setVapidDetails(
		'mailto:admin@gscortona.local',
		VAPID_PUBLIC_KEY || DEFAULT_PUBLIC,
		VAPID_PRIVATE_KEY
	);
}

async function sendToSubscriptions(subscriptions: PushSub[], title: string, body: string) {
	ensureVapid();
	const payload = JSON.stringify({
		notification: {
			title,
			body,
			icon: 'assets/gs.png'
		}
	});

	let sent = 0;
	const errors: string[] = [];
	const vapidMeta = vapidDebugMeta();
	for (const sub of subscriptions) {
		let host = '';
		try {
			host = new URL(sub.endpoint).host;
		} catch {
			host = 'invalid-url';
		}
		try {
			await webpush.sendNotification(sub, payload);
			sent++;
			// #region agent log
			fetch('http://127.0.0.1:7426/ingest/c582076e-daa3-46f3-b028-fea869801e45',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0484f6'},body:JSON.stringify({sessionId:'0484f6',hypothesisId:'D',location:'push.ts:sendToSubscriptions',message:'push send ok',data:{host,endpointLen:sub.endpoint.length,p256dhLen:sub.keys.p256dh.length,authLen:sub.keys.auth.length,vapidMeta},timestamp:Date.now()})}).catch(()=>{});
			// #endregion
		} catch (err: any) {
			const detail = {
				message: err?.message || String(err),
				statusCode: err?.statusCode ?? null,
				body: String(err?.body || '').slice(0, 300),
				host,
				endpointLen: sub.endpoint.length,
				p256dhLen: sub.keys.p256dh.length,
				authLen: sub.keys.auth.length,
				vapidMeta,
			};
			errors.push(JSON.stringify(detail));
			// #region agent log
			fetch('http://127.0.0.1:7426/ingest/c582076e-daa3-46f3-b028-fea869801e45',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0484f6'},body:JSON.stringify({sessionId:'0484f6',hypothesisId:'A,B,C,E',location:'push.ts:sendToSubscriptions',message:'push send failed',data:detail,timestamp:Date.now()})}).catch(()=>{});
			// #endregion
		}
	}

	return { sent, total: subscriptions.length, errors, vapidMeta };
}

export async function sendPushToAll(title: string, body: string) {
	const subscriptions = await loadSubscriptions();
	return sendToSubscriptions(subscriptions, title, body);
}

export async function sendPushToPersonaIds(personaIds: string[], title: string, body: string) {
	const idSet = new Set(personaIds.filter(Boolean));
	if (idSet.size === 0) {
		return { sent: 0, total: 0, errors: [] as string[] };
	}
	const subscriptions = (await loadSubscriptions()).filter((s) => idSet.has(s.personaId));
	return sendToSubscriptions(subscriptions, title, body);
}

export async function upsertPushSubscription(endpoint: string, p256dh: string, auth: string, personaId?: string | null) {
	const sheets = await authSheets();
	const result = await sheets.spreadsheets.values.get({
		spreadsheetId: SPREADSHEET_ID,
		range: SHEET_RANGE,
	});
	const rows: any[][] = result.data.values || [];
	const existingIndex = rows.findIndex((row, i) => i > 0 && String(row[0] || '').trim() === endpoint);
	const existingPersona = existingIndex >= 0 ? String(rows[existingIndex][1] || '').trim() : '';
	const persona = personaId || existingPersona;
	const values = [[endpoint, persona, p256dh, auth]];

	if (existingIndex >= 0) {
		const rowNumber = existingIndex + 1;
		await sheets.spreadsheets.values.update({
			spreadsheetId: SPREADSHEET_ID,
			range: `${SHEET_NAME}!A${rowNumber}:D${rowNumber}`,
			valueInputOption: 'RAW',
			resource: { values },
		});
	} else {
		await sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: SHEET_RANGE,
			valueInputOption: 'RAW',
			resource: { values },
		});
	}
}
