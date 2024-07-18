import { Handler, HandlerEvent } from '@netlify/functions';
const { google } = require("googleapis");

const { JSONKEY } = process.env;

async function authSheets() {
  const credentials = JSON.parse(JSONKEY!);
    //Function for authentication object
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  
    //Create client instance for auth
    const authClient = await auth.getClient();
  
    //Instance of the Sheets API
    const sheets = google.sheets({ version: "v4", auth: authClient });
  
    return {
      auth,
      authClient,
      sheets,
    };
  }

  const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
        const { sheets } = await authSheets();
        const data = JSON.parse(event.body || '');
        const id = "10km3Xk8paNpDjUAXkaAHyib8C1QjZGzNA9a5XzvVdvU";

        const res1 = await sheets.spreadsheets.get({spreadsheetId:id, ranges: [data.sheetName] });
        const sheetId = res1.data.sheets[0].properties.sheetId;

        const request:any = {
          spreadsheetId: id,
          resource: {
              requests: [
              ]
            }
          }

          if(data.currentPresenti.length > 0)
          {
            let previndx = 0;
            await data.currentPresenti.forEach((el, index)=>{
              const delDim = {
                "deleteDimension": {
                    range: {
                        sheetId:sheetId,
                        dimension:"ROWS",
                        startIndex:el-previndx-1,
                        endIndex:el -previndx
                    }
                }
              };
              previndx = index+1
    
              request.resource.requests.push(delDim);
            });
    
              const deleteRows = await sheets.spreadsheets.batchUpdate(request);

          }

          const ins = 	await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: data.sheetName,
            valueInputOption: "USER_ENTERED",
            resource: {
              values: data.presenti,
            },
          });

          return {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Presenze inserite',
              result: request
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