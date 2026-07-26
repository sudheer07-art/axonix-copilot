import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL")


def send_contact_email(name, email, subject, message):

    msg = MIMEMultipart()

    msg["From"] = EMAIL_USER
    msg["To"] = SUPPORT_EMAIL
    msg["Subject"] = f"📩 New Contact Form: {subject}"

    body = f"""
New Contact Message

Name: {name}

Email: {email}

Subject: {subject}

Message:
{message}
"""

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASSWORD)
    server.sendmail(
        EMAIL_USER,
        SUPPORT_EMAIL,
        msg.as_string(),
    )
    server.quit()