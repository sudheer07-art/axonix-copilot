from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User

from app.auth.schemas import UserSignup
from app.auth.utils import hash_password
from app.auth.schemas import UserLogin
from app.auth.utils import verify_password
from app.auth.jwt_handler import create_access_token
from app.auth.dependencies import get_current_user
from fastapi import HTTPException
router = APIRouter(prefix="/auth", tags=["Authentication"])


# @router.post("/signup")
# def signup(user: UserSignup, db: Session = Depends(get_db)):

#     existing = db.query(User).filter(
#         User.username == user.username
#     ).first()

#     if existing:
#         raise HTTPException(
#             status_code=400,
#             detail="Username already exists"
#         )

#     new_user = User(
#         username=user.username,
#         email=user.email,
#         password=hash_password(user.password)
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {
#         "message": "User created successfully"
#     }
from sqlalchemy.exc import IntegrityError

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):

    existing_username = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User created successfully"
    }
# @router.post("/login")
# def login(
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(get_db)
# ):

#     db_user = db.query(User).filter(
#     User.username == form_data.username
# ).first()

#     print("========== LOGIN DEBUG ==========")
#     print("Entered Username:", form_data.username)
#     print("Database User:", db_user)

#     if db_user:
#         print("Stored Password:", db_user.password)
#     print(
#         "Password Match:",
#         verify_password(form_data.password, db_user.password)
#     )
#     print("=================================")
#     if db_user is None:
#         raise HTTPException(
#         status_code=401,
#         detail="Invalid username or password"
#     )
#     if not verify_password(
#         form_data.password,
#         db_user.password
#     ):
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid username or password"
#         )

#     token = create_access_token(
#         {"sub": db_user.username}
#     )

#     return {
#         "access_token": token,
#         "token_type": "bearer"
    # }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        db_user = db.query(User).filter(
            User.username == form_data.username
        ).first()

        if db_user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        if not verify_password(
            form_data.password,
            db_user.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        token = create_access_token(
            {"sub": db_user.username}
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "message": "Login successful"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/me")
def get_me(current_user=Depends(get_current_user)):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }