import { HttpClient } from '@angular/common/http';
import { Handler, HandlerEvent } from '@netlify/functions';
import fetch from 'node-fetch'

const { CLIENT_SECRET } = process.env;
const { CLIENT_ID } = process.env;
const { BASEURL } = process.env;


const handler: Handler = async (event: HandlerEvent, context: any) => {
	try {
        
        const urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");
        urlencoded.append("client_id", CLIENT_ID!);
        urlencoded.append("client_secret", CLIENT_SECRET!);
        urlencoded.append("audience", BASEURL!+"api/v2/");


        const token = await fetch(BASEURL!+"oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded
          })
          const data = await token.json();
          return {
			statusCode: 200,
			body: JSON.stringify({
				message: data
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