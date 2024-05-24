from datetime import datetime, timedelta
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import re
import json
import os
from collections import OrderedDict

load_dotenv()

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
CACHE_DIR = 'email_cache'


def extract_name(email_string):
    match = re.match(r"(.+?) <.+?>", email_string)
    if match:
        return match.group(1).strip()

    match = re.match(r"([^@]+)@.+", email_string)
    if match:
        return match.group(1).strip()

    return email_string.strip()


def get_sender(email) -> str:
    sender = "Unknown Sender"
    for header in email["payload"]["headers"]:
        if header["name"] == "From":
            sender = header["value"]
            break

    sender = extract_name(sender)
    sender = sender.replace('"', '')
    return sender


def get_subject(email) -> str:
    subject = "No Subject"
    for header in email["payload"]["headers"]:
        if header["name"] == "Subject":
            subject = header["value"]
            break

    return subject


def get_sender_email(email) -> str:
    sender_email = "Unknown Sender"
    for header in email["payload"]["headers"]:
        if header["name"] == "From":
            sender = header["value"]
            sender_re = re.search(r'<(.+?)>', sender)
            if sender_re:
                sender_email = sender_re.group(1)
            else:
                sender_email = sender
            break

    return sender_email


def get_body(message):
    try:
        return message["payload"]["parts"][1]["body"]["data"]
    except (KeyError, IndexError):
        return "No body"


def load_cache(access_token):
    cache_file = os.path.join(CACHE_DIR, f'{access_token}_cache.json')
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as file:
            return json.load(file, object_pairs_hook=OrderedDict)
    return OrderedDict()


def save_cache(access_token, cache):
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)

    cache_file = os.path.join(CACHE_DIR, f'{access_token}_cache.json')
    with open(cache_file, 'w') as file:
        json.dump(cache, file, default=str)


def get_emails(access_token: str, refresh_token: str, email: str, latest_email_time: int = 0):
    if latest_email_time == 0:
        cache = OrderedDict()
    else:
        cache = load_cache(email)
    credentials = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token"
    )

    service = build('gmail', 'v1', credentials=credentials)

    # Calculate the date a day before latest_email_time
    if latest_email_time > 0:
        day_before = datetime.fromtimestamp(
            latest_email_time / 1000) - timedelta(days=1)
        query = f'after:{day_before.strftime("%Y/%m/%d")} before:{latest_email_time}'
    else:
        query = None

    results = service.users().messages().list(userId='me', q=query).execute()
    messages = results.get('messages', [])
    new_emails = OrderedDict()

    for message in messages:
        msg = service.users().messages().get(
            userId='me', id=message['id']).execute()

        timestamp_ms = int(msg["internalDate"])
        if timestamp_ms <= latest_email_time:
            continue

        id = msg["id"]
        subject = get_subject(msg)
        sender = get_sender(msg)
        sender_email = get_sender_email(msg)

        timestamp_s = timestamp_ms / 1000
        date_time = datetime.fromtimestamp(timestamp_s)

        # Check if the email is after the latest_email_time
        if date_time < datetime.fromtimestamp(latest_email_time / 1000):
            continue

        body = get_body(msg)

        new_emails[id] = {
            'subject': subject,
            'sender': sender,
            'sender_email': sender_email,
            'date': date_time,
            'body': body
        }

    combined_cache = OrderedDict(
        list(new_emails.items()) + list(cache.items()))

    save_cache(email, combined_cache)

    return combined_cache
