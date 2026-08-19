export const environment = {
    production: true,
    vapidPublicKey: 'BCxbVn1MCL9HfXhC7eCQPA5P8fodz2918RzSPRNVUAF8AWSndD1LtKg7wDvBYTDIUOaud5S4k4NQgvhZqcdDWIw',
    auth0: {
      domain: 'gscortona.us.auth0.com',
      clientId: 'WZzQptBk8JU5ymEtJZD5uFx6HGa6zujX',
      cacheLocation: 'localstorage' as const,
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email offline_access',
      },
      errorPath: '/',
      sessionCheckExpiryDays: 30
    }
  };
