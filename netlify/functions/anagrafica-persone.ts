import { Handler } from '@netlify/functions';
const { google } = require('googleapis');

const { JSONKEY } = process.env;
const SPREADSHEET_ID = '10km3Xk8paNpDjUAXkaAHyib8C1QjZGzNA9a5XzvVdvU';
const SHEET_RANGE = 'AnagraficaPersone!A:C';

async function authSheets() {
	const credentials = JSON.parse(JSONKEY!);
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const authClient = await auth.getClient();
	const sheets = google.sheets({ version: 'v4', auth: authClient });
	return { sheets };
}

const handler: Handler = async () => {
	try {
		const { sheets } = await authSheets();
		const result = await sheets.spreadsheets.values.get({
			spreadsheetId: SPREADSHEET_ID,
			range: SHEET_RANGE,
		});
		const rows: any[][] = result.data.values || [];
		const persone = rows
			.slice(1)
			.map((row) => ({
				id: String(row[0] || '').trim(),
				nome: String(row[1] || '').trim(),
				ruolo: String(row[2] || '').trim(),
			}))
			.filter((p) => p.id);

		return {
			statusCode: 200,
			body: JSON.stringify({ persone }),
		};
	} catch (e: any) {
		return {
			statusCode: 500,
			body: e.message,
		};
	}
};

export { handler };
