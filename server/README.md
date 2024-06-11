# UniMail - Server

## Setup

### Setup Azure AD App
[Register](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) your app on Azure AD and create a Single-page application. Make sure it has the permissions **Mail.Read** and **User.Read**.

### .env
Create a .env in the root dir with

```json
ORIGIN=*
GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
OUTLOOK_APP_ID=***
OUTLOOK_CLIENT_SECRET=***
```
ORIGIN: used for CORS.

GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:
Obtained via [google cloud](https://developers.google.com/identity/protocols/oauth2#1.-obtain-oauth-2.0-credentials-from-the-dynamic_data.setvar.console_name-.).

OUTLOOK_APP_ID & OUTLOOK_CLIENT_SECRET:
Obtained via your registered app on Azure AD.

## Run with docker

### Requirements
- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Python](https://www.python.org/) & [pip](https://www.geeksforgeeks.org/how-to-install-pip-on-windows/)

### Run it
```bash
docker compose up -d
```

## Run without docker

```bash
pip install -r requirements.txt
```

```bash
fastapi dev main.py
```
