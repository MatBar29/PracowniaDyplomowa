from typing import List
from fastapi import APIRouter, Depends, File, UploadFile
from .. import schemas, database
from sqlalchemy.orm import Session
from ..oauth2 import get_current_user
from ..repository import attachment

# Tworzenie routera dla obsługi załączników
router = APIRouter(tags=['attachments'])

# Endpoint do przesyłania załącznika
@router.post('/{id}/attachments', response_model=schemas.ShowAttachment)
def upload_attachment(
    id: int,  # ID zgłoszenia, do którego dodawany jest załącznik
    file: UploadFile = File(...),  # Plik przesyłany przez użytkownika
    db: Session = Depends(database.get_db),  # Sesja bazy danych
    current_user: schemas.User = Depends(get_current_user)  # Aktualnie zalogowany użytkownik
):
    # Wywołanie funkcji tworzącej załącznik w repozytorium
    return attachment.create_attachment(ticket_id=id, file=file, db=db)

# Endpoint do pobierania listy załączników dla zgłoszenia
@router.get('/{id}/attachments', response_model=List[schemas.ShowAttachment])
def get_attachments(
    id: int,  # ID zgłoszenia, dla którego pobierane są załączniki
    db: Session = Depends(database.get_db),  # Sesja bazy danych
    current_user: schemas.User = Depends(get_current_user)  # Aktualnie zalogowany użytkownik
):
    # Wywołanie funkcji pobierającej załączniki z repozytorium
    return attachment.get_attachments(ticket_id=id, db=db)
