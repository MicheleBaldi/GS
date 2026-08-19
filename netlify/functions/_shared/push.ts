const { google } = require('googleapis');
import webpush from 'web-push';

const { JSONKEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
const SPREADSHEET_ID = '10km3Xk8paNpDjUAXkaAHyib8C1QjZGzNA9a5XzvVdvU';
const SHEET_NAME = 'Notifiche';
const SHEET_RANGE = `${SHEET_NAME}!A:D`;

const DEFAULT_PUBLIC = 'BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo';

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
	for (const sub of subscriptions) {
		try {
			await webpush.sendNotification(sub, payload);
			sent++;
		} catch (err: any) {
			errors.push(err?.message || String(err));
		}
	}

	return { sent, total: subscriptions.length, errors };
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
