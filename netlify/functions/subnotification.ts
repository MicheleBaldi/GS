import { Handler, HandlerEvent } from '@netlify/functions';
import Airtable from 'airtable';

// Initialize Airtable connection
const { AIRTABLE_KEY } = process.env;

// USE YOUR TABLE BASE HERE
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base('appeK7aRGtPSKdLMp');

const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
        const data = JSON.parse(event.body || '');

		await base('Sub Notification').create([{
			"fields":{
                Persona: [data.personaid],
                Sub: [data.sub]
        }
		}]);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Consenso notifiche'
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