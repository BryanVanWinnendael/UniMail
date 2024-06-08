import base64
import imaplib
import email
from email.header import decode_header
from datetime import datetime
from functools import partial
import re
from collections import OrderedDict
from multiprocessing import Pool, cpu_count


def encode_to_base64(content):
    return base64.b64encode(content.encode()).decode("utf-8")


def extract_name(email_string):
    match = re.match(r"(.+?) <.+?>", email_string)
    if match:
        return match.group(1).strip()
    match = re.match(r"([^@]+)@.+", email_string)
    if match:
        return match.group(1).strip()
    return email_string.strip()


def get_sender(email_msg) -> str:
    sender = "Unknown Sender"
    if "From" in email_msg:
        sender = email_msg["From"]
    sender = extract_name(sender)
    sender = sender.replace('"', '')
    return sender


def get_subject(email_msg) -> str:
    subject = "No Subject"
    if "Subject" in email_msg:
        subject, encoding = decode_header(email_msg["Subject"])[0]
        if isinstance(subject, bytes):
            subject = subject.decode(encoding if encoding else 'utf-8')
    return subject


def get_sender_email(email_msg) -> str:
    sender_email = "Unknown Sender"
    if "From" in email_msg:
        sender = email_msg["From"]
        sender_re = re.search(r'<(.+?)>', sender)
        if sender_re:
            sender_email = sender_re.group(1)
        else:
            sender_email = sender
    return sender_email


def get_body(email_msg):
    body = "No body"
    if email_msg.is_multipart():
        for part in email_msg.walk():
            if part.get_content_type() == "text/html":
                body = part.get_payload(decode=True).decode()
                return encode_to_base64(body)
            elif part.get_content_type() == "text/plain":
                body = part.get_payload(decode=True).decode()
    else:
        body = email_msg.get_payload(decode=True).decode()
    return encode_to_base64(body)


def process_message(message, receiver_email):
    msg = email.message_from_bytes(message)

    timestamp_ms = email.utils.mktime_tz(email.utils.parsedate_tz(msg["Date"]))
    date_time = datetime.fromtimestamp(timestamp_ms)

    id = msg["Message-ID"]
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


def get_emails(email_address: str, encrypted_password: str, imap_server: str, imap_port: int):
    password = base64.b64decode(encrypted_password).decode("utf-8")
    start_time = datetime.now()

    # Connect to the server
    mail = imaplib.IMAP4_SSL(imap_server, imap_port)

    try:
        mail.login(email_address, password)

        # Select the mailbox you want to check
        status, messages = mail.select("INBOX")
        if status != "OK":
            print(f"Error selecting mailbox: {status}")
            return []

        status, messages = mail.search(None, "ALL")
        if status != "OK":
            print(f"Error searching emails: {status}")
            return []

        email_ids = messages[0].split()
        new_emails = OrderedDict()

        cpus = cpu_count()

        with Pool(cpus) as pool:
            partial_process_message = partial(
                process_message, receiver_email=email_address)
            result = pool.map(partial_process_message, [mail.fetch(
                eid, "(RFC822)")[1][0][1] for eid in email_ids])
            for id, email_object in result:
                if email_object:
                    new_emails[id] = email_object

    except imaplib.IMAP4.error as e:
        print(f"IMAP error: {e}")

    finally:
        mail.logout()

    end_time = datetime.now()
    print(
        f"Time taken to fetch emails: {end_time - start_time} with {cpus} cores.")
    return new_emails.items()


def test_connection(email_address: str, encrypted_password: str, imap_server: str, imap_port: int):
    password = base64.b64decode(encrypted_password).decode("utf-8")
    mail = imaplib.IMAP4_SSL(imap_server, imap_port)

    try:
        mail.login(email_address, password)
        mail.logout()
        return {
            "message": "Connection successful",
            "success": True
        }
    except imaplib.IMAP4.error as e:
        print(f"IMAP error: {e}")
        return {
            "message": str(e),
            "success": False
        }
