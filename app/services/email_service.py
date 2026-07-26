import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_contact_email(name, email, subject, message):
    
    print("=" * 50)
    print("Background email task started")
    print(name)
    print(email)
    print(subject)
    print(message)
    print("=" * 50)

    resend.Emails.send({

        "from": "onboarding@resend.dev",

        "to": os.getenv("SUPPORT_EMAIL"),

        "subject": f"📩 New Contact Form - {subject}",

        "html": f"""

        <h2>New Contact Message</h2>

        <hr>

        <p><strong>Name:</strong> {name}</p>

        <p><strong>Email:</strong> {email}</p>

        <p><strong>Subject:</strong> {subject}</p>

        <br>

        <p>{message}</p>

        """

    })