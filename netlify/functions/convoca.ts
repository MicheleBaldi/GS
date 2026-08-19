import { Handler, HandlerEvent } from '@netlify/functions';
import Airtable from 'airtable';
import { sendPushToPersonaIds } from './_shared/push';

const { AIRTABLE_KEY } = process.env;
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base('appeK7aRGtPSKdLMp');

const handler: Handler = async (event: HandlerEvent) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
		}

		const data = JSON.parse(event.body || '{}');
		const uscitaId = data.uscitaId as string;
		const titolo = (data.titolo as string) || '';
		const luogo = (data.luogo as string) || '';
		const updates = data.updates as { personaId: string; convocato: boolean }[];
		if (!uscitaId) {
			return { statusCode: 400, body: JSON.stringify({ message: 'uscitaId obbligatorio' }) };
		}
		if (!Array.isArray(updates) || updates.length === 0) {
			return { statusCode: 400, body: JSON.stringify({ message: 'updates obbligatorio' }) };
		}

		const records = await base('Gestione Uscite').select({
			fields: ['Presenti', 'Convocato', 'Uscita']
		}).all();

		const matched = records.filter((record) => {
			const uscite = (record.fields.Uscita as string[]) || [];
			return uscite.includes(uscitaId);
		});

		const payload: { id: string; fields: { Convocato: boolean } }[] = [];
		const newlyConvocati: string[] = [];

		for (const update of updates) {
			if (!update.personaId) {
				continue;
			}
			const record = matched.find((r) => {
				const presenti = (r.fields.Presenti as string[]) || [];
				return presenti[0] === update.personaId;
			});
			if (!record) {
				continue;
			}
			const wasConvocato = !!record.fields.Convocato;
			const nowConvocato = !!update.convocato;
			if (!wasConvocato && nowConvocato) {
				newlyConvocati.push(update.personaId);
			}
			payload.push({
				id: record.id,
				fields: { Convocato: nowConvocato }
			});
		}

		for (let i = 0; i < payload.length; i += 10) {
			await base('Gestione Uscite').update(payload.slice(i, i + 10));
		}

		let push: { sent: number; total: number; errors: string[] } | undefined;
		if (newlyConvocati.length > 0) {
			const body = luogo ? `${titolo} — ${luogo}` : titolo;
			try {
				push = await sendPushToPersonaIds(newlyConvocati, 'Sei stato convocato', body);
			} catch (err: any) {
				push = { sent: 0, total: 0, errors: [err?.message || String(err)] };
			}
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Convocazioni aggiornate',
				push
			})
		};
	} catch (e: any) {
		return {
			statusCode: 500,
			body: e.message
		};
	}
};

export { handler };
