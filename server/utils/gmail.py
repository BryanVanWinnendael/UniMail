from datetime import datetime
from functools import partial
from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import re
import os
from collections import OrderedDict
from multiprocessing import Pool, cpu_count
load_dotenv()


CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")


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
        if "parts" in message["payload"] and len(message["payload"]["parts"]) > 1:
            return message["payload"]["parts"][1].get("body", {}).get("data", "No body")
        else:
            return message["payload"]["body"].get("data", "No body")
    except KeyError:
        return "No body"


def process_thread(thread, service, receiver_email):
    tdata = service.users().threads().get(
        userId="me", id=thread["id"]).execute()
    msg = tdata["messages"][0]

    timestamp_ms = int(msg["internalDate"])
    timestamp_s = timestamp_ms / 1000
    date_time = datetime.fromtimestamp(timestamp_s)

    id = msg["id"]
    subject = get_subject(msg)
    sender = get_sender(msg)
    sender_email = get_sender_email(msg)
    body = get_body(msg)

    return id, {
        'subject': subject,
        'sender': sender,
        'sender_email': sender_email,
        'date': date_time,
        'body': body,
        'receiver': receiver_email
    }


def get_emails(access_token: str, refresh_token: str, email: str):
    start_time = datetime.now()

    credentials = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token"
    )

    service = build('gmail', 'v1', credentials=credentials)

    threads = service.users().threads().list(
        userId="me").execute().get("threads", [])
    new_emails = OrderedDict()

    cpus = cpu_count()

    with Pool(cpus) as pool:
        partial_process_thread = partial(
            process_thread, service=service, receiver_email=email)
        result = pool.map(partial_process_thread, threads)
        for id, email_object in result:
            if email_object:
                new_emails[id] = email_object

    end_time = datetime.now()
    print(f"Time taken to fetch emails: {end_time - start_time}")
    return new_emails.items()
