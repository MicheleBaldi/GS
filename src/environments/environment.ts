export const environment = {
    production: true,
    auth0: {
      domain: 'dev-vs8dyay8d5sqq717.us.auth0.com',
      clientId: 'cE0OM5S9HIwk5pYcEWDrNtZK2cTeyahB',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      errorPath: '/',
      scope: 'openid profile email'
    }
  };