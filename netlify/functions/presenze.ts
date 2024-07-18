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
    const spreadsheetId = "10km3Xk8paNpDjUAXkaAHyib8C1QjZGzNA9a5XzvVdvU" // Please set the Spreadsheet ID.
    const sheetName = event.queryStringParameters != null ? event.queryStringParameters['sheetName'] : "Foglio1";
    const datePresenze = event.queryStringParameters != null ? event.queryStringParameters['datePresenze'] : "";

    const res1 = await sheets.spreadsheets.get({spreadsheetId:spreadsheetId, ranges: [sheetName] });
    const sheetId = res1.data.sheets[0].properties.sheetId;
    const request = {
      spreadsheetId: spreadsheetId,
      resource: {
          requests: [{
              "setBasicFilter": {
                  filter: {
                      range: {
                          sheetId: sheetId
                      },
                      filterSpecs: [
                          {
                              filterCriteria: {
                                  condition: {
                                      type: 'DATE_EQ',
                                      values: [{"userEnteredValue": datePresenze}]
                                  }
                              },
                              columnIndex: 0
                          }
                      ]
                  }
              }
          }]
      }
  }

   const setFilter = await sheets.spreadsheets.batchUpdate(request);

  // 3. Retrieve the values of `rowMetadata` of the sheet.
    const res2 = await sheets.spreadsheets.get({
      spreadsheetId:spreadsheetId,
      ranges: [sheetName],
      fields: "sheets",
    });

    const values = await res2.data.sheets[0].data[0].rowMetadata.reduce(
      (o, r, i) => {
        if (r.hiddenByFilter && r.hiddenByFilter === true) {
          o.hiddenRows.push(i + 1);
        } else {
          o.showingRows.push(i + 1);
        }
        return o;
      },
      { hiddenRows: [], showingRows: [] }
    );

    const getRows = await sheets.spreadsheets.values.get({
              spreadsheetId: spreadsheetId,
              range: sheetName,
            });
    
    const currentPres:any =[];

    values.showingRows.slice(1).forEach(e =>{
      currentPres.push(getRows.data.values.at(e-1));
    })
    
    const result:any = {currentPres:currentPres, values:values.showingRows.slice(1)};


    const requestClear = {
      spreadsheetId: spreadsheetId,
      resource: {
          requests: [{
              "clearBasicFilter": {
                  "sheetId": sheetId
              }
          }]
      }
  }

  const clearFilter = await sheets.spreadsheets.batchUpdate(requestClear);

  
  return {
			statusCode: 200,
			body: JSON.stringify({
				result
			})
    }
		
	} catch (e: any) {
		return {
			statusCode: 500,
			body: e.message
		};
	}
};

export { handler };