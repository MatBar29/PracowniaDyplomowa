from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from blog.enum_models import RoleEnum
from blog.models import User
from . import schemas
from . import token
from sqlalchemy.orm import Session
from .database import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(data: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    return token.verify_token(data, credentials_exception)

def is_admin(
    token_data=Depends(get_current_user),  # Używa istniejącej funkcji get_current_user
    db: Session = Depends(get_db)
):
    # Pobiera użytkownika na podstawie ID z tokena
    user = db.query(User).filter(User.id == token_data.id).first()

    # Sprawdza, czy istnieje i czy ma rolę "admin"
    if user is None or user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Niedozwolony dostęp"
        )
    return user
