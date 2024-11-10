from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from blog.enum_models import RoleEnum
from blog.models import User
from . import schemas
from . import token
from sqlalchemy.orm import Session
from .database import get_db


# Używamy OAuth2PasswordBearer, aby uzyskać token w nagłówku
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(request: Request, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Pobranie tokenu z ciasteczka
    token_data = request.cookies.get("jwt_token")
    if not token_data:
        raise credentials_exception

    # Weryfikacja tokenu i pobranie ID użytkownika
    user_id = token.verify_token(token_data, credentials_exception)

    # Pobranie użytkownika z bazy danych na podstawie ID
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user  # Zwróć pełny obiekt użytkownika, nie tylko ID



def is_admin(
    token_data=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == token_data.id).first()

    if user is None or user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Niedozwolony dostęp"
        )
    return user
