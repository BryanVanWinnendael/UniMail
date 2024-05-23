import base64
import os
from dotenv import load_dotenv
import requests
from datetime import datetime

load_dotenv()


APPLICATION_ID = os.environ.get("OUTLOOK_APP_ID")
CLIENT_SECRET = os.environ.get("OUTLOOK_CLIENT_SECRET")
authority_url = 'https://login.microsoftonline.com/consumers'
base_url = f'https://graph.microsoft.com/v1.0/'


def encode_to_base64(content):
    encoded_content = base64.b64encode(content.encode()).decode("utf-8")
    return encoded_content


def get_emails(access_token: str):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    endpoint = base_url + 'me/messages'
    try:
        response = requests.get(endpoint, headers=headers)
    except Exception as e:
        return None

    json = response.json()
    mails = json['value']
    res = {}

    for mail in mails:
        id = mail.get('id', None)
        subject = mail.get('subject', None)
        sender_info = mail.get('sender', {}).get('emailAddress', {})
        sender = sender_info.get('name', None)
        if not sender:
            continue
        sender_email = sender_info.get('address', None)

        received_date_time = mail.get('receivedDateTime', None)

        if received_date_time:
            try:
                date_time = datetime.strptime(
                    received_date_time, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                date_time = None
        else:
            date_time = None

        content = mail.get('body', {}).get('content', None)
        body = encode_to_base64(content)

        res[id] = {
            'subject': subject,
            'sender': sender,
            'sender_email': sender_email,
            'date': date_time,
            'body': body
        }
    return res
