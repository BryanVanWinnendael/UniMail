import base64
from collections import OrderedDict
import os
from dotenv import load_dotenv
import requests
from datetime import datetime, timedelta, timezone
from utils.cache import load_cache, save_cache
import pytz

load_dotenv()

APPLICATION_ID = os.environ.get("OUTLOOK_APP_ID")
CLIENT_SECRET = os.environ.get("OUTLOOK_CLIENT_SECRET")
authority_url = 'https://login.microsoftonline.com/consumers'
base_url = 'https://graph.microsoft.com/v1.0/'


def encode_to_base64(content):
    return base64.b64encode(content.encode()).decode("utf-8")


def get_emails(access_token: str, email: str, latest_email_time: int = 0):
    if latest_email_time == 0:
        cache = OrderedDict()
    else:
        cache = load_cache(email)

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    latest_email_time_utc = datetime.fromtimestamp(
        latest_email_time / 1000)
    # Convert latest_email_time from milliseconds to datetime with UTC timezone
    if latest_email_time > 0:
        query = (
            f"$filter=receivedDateTime gt {latest_email_time_utc.strftime('%Y-%m-%dT%H:%M:%SZ')}"
            "&$select=subject,receivedDateTime,sender,body"
            "&$top=500"
        )
        endpoint = f"{base_url}me/messages?{query}"
    else:
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
        return cache  # Return the existing cache if there's an error

    json = response.json()
    mails = json.get('value', [])
    new_emails = OrderedDict()
    for mail in mails:
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

        # Only consider emails after the latest_email_time in UTC
        if date_time and date_time <= latest_email_time_utc:
            continue

        content = mail.get('body', {}).get('content', '')
        body = encode_to_base64(content)

        new_emails[id] = {
            'subject': subject,
            'sender': sender,
            'sender_email': sender_email,
            'date': date_time.replace(tzinfo=pytz.UTC),
            'body': body
        }

    combined_cache = OrderedDict(
        list(new_emails.items()) + list(cache.items())
    )

    save_cache(email, combined_cache)

    return combined_cache
