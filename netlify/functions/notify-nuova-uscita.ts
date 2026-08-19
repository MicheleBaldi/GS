/**
 * Webhook for new Uscite notifications.
 *
 * Zapier setup (manual):
 * 1. Trigger: Airtable → New Record (table Uscite)
 * 2. Action: Webhooks by Zapier → POST
 *    URL: https://<site>/.netlify/functions/notify-nuova-uscita
 *    Payload Type: JSON
 *    Data: titolo ← Titolo, luogo ← Luogo, recordId ← Record ID
 *    Headers: X-Webhook-Secret = value of ZAPIER_WEBHOOK_SECRET (Netlify env)
 * 3. Test and Publish the Zap
 *
 * Netlify env required: ZAPIER_WEBHOOK_SECRET, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, JSONKEY
 */
import { Handler, HandlerEvent } from '@netlify/functions';
import { sendPushToAll } from './_shared/push';

const handler: Handler = async (event: HandlerEvent) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
		}

		const secret = process.env.ZAPIER_WEBHOOK_SECRET;
		const incoming = event.headers['x-webhook-secret'] || event.headers['X-Webhook-Secret'];
		if (!secret || incoming !== secret) {
			return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
		}

		const data = JSON.parse(event.body || '{}');
		const titolo = data.titolo || data.Titolo || 'Senza titolo';
		const luogo = data.luogo || data.Luogo || '';
		const body = luogo ? `${titolo} — ${luogo}` : titolo;

		const result = await sendPushToAll('Nuova uscita', body);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Notifica nuova uscita inviata: ${result.sent}/${result.total}`,
				...result
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
