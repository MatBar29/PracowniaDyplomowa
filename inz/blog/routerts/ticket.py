from http.client import HTTPException
from fastapi import APIRouter, Depends, status, Response
from blog.enum_models import RoleEnum
from .. import schemas, database
from typing import List
from sqlalchemy.orm import Session
from ..repository import ticket
from ..oauth2 import get_current_user, is_admin, is_service

# Tworzenie routera dla obsługi zgłoszeń
router = APIRouter(tags=['tickets'], prefix='/ticket')

# Endpoint do pobierania wszystkich zgłoszeń
@router.get("/")
def get_tickets(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    # Pobranie wszystkich zgłoszeń dla zalogowanego użytkownika
    tickets = ticket.get_all(db, current_user)
    return tickets  # Zwracanie danych w odpowiedzi

# Endpoint do tworzenia nowego zgłoszenia
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Ticket, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    # Utworzenie nowego zgłoszenia w bazie danych
    return ticket.create(request, db, current_user)

# Endpoint do usuwania zgłoszenia
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user), user=Depends(is_admin)):
    # Usunięcie zgłoszenia na podstawie ID (tylko dla administratorów)
    return ticket.delete(id, db)

# Endpoint do aktualizacji zgłoszenia
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.TicketUpdate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user), user=Depends(is_service)):
    # Aktualizacja zgłoszenia na podstawie ID (tylko dla użytkowników z rolą "service")
    return ticket.update(id, request, db)

# Endpoint do pobierania szczegółów zgłoszenia
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowTicket)
def show(id: int, response: Response, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    # Pobranie szczegółowych informacji o zgłoszeniu na podstawie ID
    return ticket.show(id, db)

# Endpoint do ustawiania szacowanego czasu realizacji zgłoszenia
@router.put("/{id}/estimate", status_code=status.HTTP_200_OK)
def estimate_hours(id: int, data: schemas.EstimateHours, db: Session = Depends(database.get_db), user=Depends(is_admin)):
    # Ustawienie szacowanego czasu realizacji zgłoszenia (tylko dla administratorów)
    return ticket.set_estimated_hours(id, data.estimated_hours, db)

# Endpoint do logowania przepracowanych godzin dla zgłoszenia
@router.put("/{id}/log-time", status_code=status.HTTP_200_OK)
def log_worked_hours(
    id: int,
    data: schemas.AddWorkedHours,  # Dane dotyczące przepracowanych godzin
    db: Session = Depends(database.get_db),  # Sesja bazy danych
    current_user: schemas.User = Depends(get_current_user),  # Aktualnie zalogowany użytkownik
):
    # Sprawdzenie, czy użytkownik ma rolę "service"
    if current_user.role != RoleEnum.service:
        raise HTTPException(status_code=403, detail="Brak dostępu")
    # Dodanie przepracowanych godzin do zgłoszenia
    return ticket.add_worked_hours(id, data.worked_hours, db)