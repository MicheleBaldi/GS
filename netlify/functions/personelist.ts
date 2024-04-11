import { Handler, HandlerEvent } from '@netlify/functions';
import Airtable from 'airtable';

// Initialize Airtable connection
const { AIRTABLE_KEY } = process.env;

// USE YOUR TABLE BASE HERE
const base = new Airtable({ apiKey: AIRTABLE_KEY }).base('appeK7aRGtPSKdLMp');

const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
		let fields:string[] = ["Nome"];
		const persone =  await base('Persone').select({
			view: "Elenco Tesserati Attivi",
			fields:fields
		}).all();


		return {
			statusCode: 200,
			body: JSON.stringify({
				persone
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