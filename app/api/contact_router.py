from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.contact_schema import ContactCreate
from app.schemas.contact_schema import ContactResponse

from app.services.contact_service import save_contact

router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)


@router.post(
    "/",
    response_model=ContactResponse,
)
def contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
):

    return save_contact(contact, db)