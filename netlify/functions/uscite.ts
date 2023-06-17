import { Handler, HandlerEvent } from '@netlify/functions';
import Airtable from 'airtable';

// Initialize Airtable connection
const { AIRTABLE_KEY } = process.env;

// USE YOUR TABLE BASE HERE
const base = new Airtable({ apiKey: 'patwyqLWjyZr5xPay.a9dc6101277f1b32e514d7f8c02310c59007a55a85508ce4e76f297a21e7f4ef' }).base('appeK7aRGtPSKdLMp');

const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
		const uscite =  await base('Uscite').select({
			view: "Uscite Future"
		}).all();

		return {
			statusCode: 200,
			body: JSON.stringify({
				uscite
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