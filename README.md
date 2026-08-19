# GsApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

## Auth0 (sessione PWA)

L'app usa `cacheLocation: 'localstorage'` e `useRefreshTokens: true` con scope `offline_access`.

Nella Auth0 Dashboard, sulla Application SPA:
1. Abilitare **Refresh Token Rotation**
2. Configurare **Refresh Token Expiration**
3. Assicurarsi che lo scope `offline_access` sia consentito

Senza questi step il client non può rinnovare la sessione dopo la chiusura della PWA.

## Web Push e Zapier (nuova uscita)

Env Netlify richieste: `AIRTABLE_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `ZAPIER_WEBHOOK_SECRET`.

Tabella Airtable **Sub Notification** con campi: `Endpoint`, `P256dh`, `Auth`, `PersonaId` (opzionale).

### Zapier — notifica alla creazione di un'Uscita

1. Trigger: **Airtable → New Record** (tabella **Uscite**)
2. Action: **Webhooks by Zapier → POST**
   - URL: `https://<site>/.netlify/functions/notify-nuova-uscita`
   - Payload Type: JSON
   - Data: `titolo` ← Titolo, `luogo` ← Luogo, `recordId` ← Record ID
   - Headers: `X-Webhook-Secret` = valore di `ZAPIER_WEBHOOK_SECRET`
3. Test e Publish dello Zap

In app (Home, solo responsabili): **Attiva notifiche** e **Invia notifica di esempio**.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
