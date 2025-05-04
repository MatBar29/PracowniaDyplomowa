from fastapi import APIRouter, Depends, status
from .. import schemas, database
from typing import List
from sqlalchemy.orm import Session
from ..repository import comment
from ..oauth2 import get_current_user, is_admin

# Tworzenie routera dla obsługi komentarzy
router = APIRouter(tags=['comments'], prefix='/comment')

# Endpoint do pobierania wszystkich komentarzy
@router.get('/', response_model=List[schemas.ShowComment])
def all(
    db: Session = Depends(database.get_db),  # Sesja bazy danych
    current_user: schemas.User = Depends(get_current_user)  # Aktualnie zalogowany użytkownik
):
    # Pobranie wszystkich komentarzy z bazy danych
    return comment.get_all(db)

# Endpoint do tworzenia nowego komentarza
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.CreateComment,  # Dane nowego komentarza
    db: Session = Depends(database.get_db),  # Sesja bazy danych
    current_user: schemas.User = Depends(get_current_user)  # Aktualnie zalogowany użytkownik
):
    # Utworzenie nowego komentarza w bazie danych
    return comment.create(request, db, current_user)