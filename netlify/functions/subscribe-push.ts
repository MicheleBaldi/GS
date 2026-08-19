import { Handler, HandlerEvent } from '@netlify/functions';
import { upsertPushSubscription } from './_shared/push';

/**
 * Persists Web Push subscriptions in Google Sheet "Notifiche".
 * Expected columns: Sub, Persona, P256dh, Auth.
 */
const handler: Handler = async (event: HandlerEvent) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
		}

		const data = JSON.parse(event.body || '{}');
		const endpoint = data.endpoint as string;
		const keys = data.keys || {};
		if (!endpoint || !keys.p256dh || !keys.auth) {
			return { statusCode: 400, body: JSON.stringify({ message: 'subscription incompleta' }) };
		}

		await upsertPushSubscription(endpoint, keys.p256dh, keys.auth, data.personaid || null);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Subscription salvata' })
		};
	} catch (e: any) {
		return {
			statusCode: 500,
			body: e.message
		};
	}
};

export { handler };
