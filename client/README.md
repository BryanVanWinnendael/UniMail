# UniMail - Client

## Setup

### Setup Azure AD App
[Register](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) your app on Azure AD and create a Single-page application. Make sure it has the premissions **Mail.Read** and **User.Read**.

### Setup Yahoo Developer App
[Register](https://developer.yahoo.com/apps/) your app on yahoo developer. Make sure to check OpenID Connect Permissions -> Email and Profile.

### .env
Create a .env in the root dir with

```json
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=***
NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET=***
NEXT_PUBLIC_AZURE_AD_TENANT_ID=***

NEXT_PUBLIC_GOOGLE_CLIENT_ID=***
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000

NEXT_PUBLIC_YAHOO_CLIENT_ID=***
NEXT_PUBLIC_YAHOO_CLIENT_SECRET=***
NEXT_PUBLIC_YAHOO_REDIRECT_URI=***

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/
```

NEXT_PUBLIC_GOOGLE_CLIENT_ID & NEXT_PUBLIC_GOOGLE_CLIENT_ID:
Obtained via [google cloud](https://developers.google.com/identity/protocols/oauth2#1.-obtain-oauth-2.0-credentials-from-the-dynamic_data.setvar.console_name-.).

NEXT_PUBLIC_AZURE_AD_CLIENT_ID, NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET and NEXT_PUBLIC_AZURE_AD_TENANT_ID:
Obtained via your registered app on Azure AD.

NEXT_PUBLIC_YAHOO_CLIENT_ID, NEXT_PUBLIC_YAHOO_CLIENT_SECRET and NEXT_PUBLIC_YAHOO_REDIRECT_URI obtained via [yahoo developer](https://developer.yahoo.com/apps/)

NEXT_PUBLIC_GOOGLE_REDIRECT_URI should be the url of your client homepage.

NEXT_PUBLIC_API_URL should be the url of UniMail Server.


## Run

### Requirements
- [Node.js](https://nodejs.org/en)

```bash
npm i
```

```bash
npm run dev
```
