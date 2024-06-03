import base64
from collections import OrderedDict
from functools import partial
from multiprocessing import Pool, cpu_count
import os
from dotenv import load_dotenv
import requests
from datetime import datetime
import pytz

load_dotenv()

APPLICATION_ID = os.environ.get("OUTLOOK_APP_ID")
CLIENT_SECRET = os.environ.get("OUTLOOK_CLIENT_SECRET")
authority_url = 'https://login.microsoftonline.com/consumers'
base_url = 'https://graph.microsoft.com/v1.0/'


def encode_to_base64(content):
    return base64.b64encode(content.encode()).decode("utf-8")


def process_thread(mail, email):
    id = mail.get('id')
    subject = mail.get('subject', 'No Subject')
    sender_info = mail.get('sender', {}).get('emailAddress', {})
    sender = sender_info.get('name', 'Unknown Sender')
    sender_email = sender_info.get('address', 'Unknown Sender')

    received_date_time = mail.get('receivedDateTime')
    if received_date_time:
        try:
            date_time = datetime.strptime(
                received_date_time, "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            date_time = None
    else:
        date_time = None

    content = mail.get('body', {}).get('content', '')
    body = encode_to_base64(content)

    return id, {
        'subject': subject,
        'sender': sender,
        'sender_email': sender_email,
        'date': date_time.replace(tzinfo=pytz.UTC),
        'body': body,
        'receiver': email,
    }


def get_emails(access_token: str, email: str):
    start_time = datetime.now()

    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    query = (
        "$select=subject,receivedDateTime,sender,body"
        "&$top=500"
    )
    endpoint = f"{base_url}me/messages?{query}"

    try:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching emails: {e}")
        return {}

    json = response.json()
    mails = json.get('value', [])
    new_emails = OrderedDict()

    cpus = cpu_count()

    with Pool(cpus) as pool:
        partial_process_thread = partial(
            process_thread, email=email)
        result = pool.map(partial_process_thread, mails)
        for id, email_object in result:
            if email_object:
                new_emails[id] = email_object

    end_time = datetime.now()
    print(
        f"Time taken to fetch emails: {end_time - start_time} with {cpus} cores.")
    return new_emails.items()
