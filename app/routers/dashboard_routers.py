from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.dashboard_schema import DashboardResponse

from app.services.dashboard_services import get_dashboard_data

from app.auth.dependencies import get_current_user

from app.database.models import User
from fastapi import Request




router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"]

)

import traceback




@router.get("/")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("\n===== DASHBOARD REQUEST =====")
    traceback.print_stack(limit=5)
    print("=============================\n")

    return get_dashboard_data(db, current_user.id)
# ==========================================
# GET DASHBOARD
# ==========================================

@router.get(

    "/",

    response_model=DashboardResponse

)

def dashboard(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    return get_dashboard_data(

        db,

        current_user.id

    )