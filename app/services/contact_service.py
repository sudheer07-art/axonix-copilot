from sqlalchemy.orm import Session

from app.models.contact_model import Contact
from fastapi import BackgroundTasks
from app.services.email_service import send_contact_email
from app.schemas.contact_schema import ContactCreate
from app.services.email_service import send_contact_email

def save_contact(
    data: ContactCreate,
    db: Session,
    background_tasks: BackgroundTasks,
):

    contact = Contact(

        name=data.name,

        email=data.email,

        subject=data.subject,

        message=data.message,

    )

    db.add(contact)

    db.commit()

    db.refresh(contact)

    background_tasks.add_task(

        send_contact_email,

        contact.name,

        contact.email,

        contact.subject,

        contact.message,

    )

    return {

        "success": True,

        "message": "Message sent successfully."

    }