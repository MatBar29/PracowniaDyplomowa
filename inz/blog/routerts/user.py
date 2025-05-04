from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy import or_
from blog.oauth2 import get_current_user, is_admin
from blog import models
from blog.enum_models import RoleEnum
from .. import database, schemas
from sqlalchemy.orm import Session
from ..repository import user

# Tworzenie routera dla obsługi użytkowników
router = APIRouter(tags=['users'], prefix='/user')

# Funkcja do uzyskania sesji bazy danych
get_db = database.get_db

# Endpoint do tworzenia nowego użytkownika
@router.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser)
def create(request: schemas.User, db: Session = Depends(get_db)):
    # Wywołanie funkcji tworzącej użytkownika w repozytorium
    return user.create(request, db)

# Endpoint do sprawdzania statusu aktualnie zalogowanego użytkownika
@router.get('/status', response_model=schemas.ShowUser)
async def check_status(current_user: models.User = Depends(get_current_user)):
    # Zwraca obiekt aktualnie zalogowanego użytkownika, w tym jego rolę
    return current_user

# Endpoint do pobierania szczegółów użytkownika na podstawie ID
@router.get('/{id}', response_model=schemas.ShowUser)
def show(id: int, db: Session = Depends(get_db)):
    # Pobranie użytkownika z bazy danych na podstawie ID
    return user.show(id, db)

# Endpoint do pobierania listy wszystkich użytkowników
@router.get('/', response_model=List[schemas.ShowUserT])
def get_all_users(db: Session = Depends(get_db)):
    # Pobranie wszystkich użytkowników z bazy danych
    return db.query(models.User).all()

# Endpoint do aktualizacji danych użytkownika na podstawie adresu e-mail
@router.put('/{email}', status_code=status.HTTP_202_ACCEPTED)
def update(email: str, request: schemas.UserUpdate, db: Session = Depends(get_db), usera=Depends(is_admin)):
    # Aktualizacja danych użytkownika (dostępna tylko dla administratorów)
    return user.update(email, request, db)

# Endpoint do pobierania użytkowników z rolą "admin" lub "service"
@router.get('/service/', response_model=List[schemas.ShowUserT])
def get_service_and_admin_users(db: Session = Depends(get_db)):
    # Pobranie użytkowników, którzy mają rolę "admin" lub "service"
    return db.query(models.User).filter(
        or_(
            models.User.role == RoleEnum.admin,
            models.User.role == RoleEnum.service
        )
    ).all()


