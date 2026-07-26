from sqlalchemy.orm import Session

from app.models.contact_model import Contact

from app.schemas.contact_schema import ContactCreate


def save_contact(data: ContactCreate, db: Session):

    contact = Contact(

        name=data.name,

        email=data.email,

        subject=data.subject,

        message=data.message,

    )

    db.add(contact)

    db.commit()

    db.refresh(contact)

    return {

        "success": True,

        "message": "Message sent successfully."

    }