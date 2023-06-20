import { Handler, HandlerEvent } from '@netlify/functions';
import Airtable from 'airtable';

// Initialize Airtable connection
const { AIRTABLE_KEY } = process.env;

// USE YOUR TABLE BASE HERE
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base('appeK7aRGtPSKdLMp');

const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
        const data = JSON.parse(event.body || '');

		await base('Gestione Uscite').create([{
			"fields":{
                Presenti: [data.persona],
                Convocato: false,
                Uscita: [data.uscita]
        }
		}]);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'OK!'
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