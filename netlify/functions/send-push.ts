import { Handler, HandlerEvent } from '@netlify/functions';
import { sendPushToAll } from './_shared/push';

const handler: Handler = async (event: HandlerEvent) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
		}

		const data = JSON.parse(event.body || '{}');
		const title = data.title || 'GsApp';
		const body = data.body || 'Notifica di esempio';
		const result = await sendPushToAll(title, body);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Notifiche inviate: ${result.sent}/${result.total}`,
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
