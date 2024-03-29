export const environment = {
    production: true,
    auth0: {
      domain: 'gscortona.us.auth0.com',
      clientId: 'WZzQptBk8JU5ymEtJZD5uFx6HGa6zujX',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      errorPath: '/',
      scope: 'openid profile email'
    }
  };