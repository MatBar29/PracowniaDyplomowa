import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from blog.enum_models import RoleEnum
from .. import models, schemas
from sqlalchemy import or_

# Funkcja do pobierania wszystkich zgłoszeń
def get_all(db: Session, current_user: schemas.User):
    if current_user.role == RoleEnum.admin:
        # Admin/Manager widzi wszystkie tickety
        return db.query(models.Ticket).all()
    elif current_user.role == RoleEnum.service:
        # Service widzi tickety przypisane do niego i te, które stworzył
        return db.query(models.Ticket).filter(
            or_(
                models.Ticket.user_id == current_user.id,
                models.Ticket.assigned_to_id == current_user.id
            )
        ).all()
    else:
        # Zwykły użytkownik widzi tylko swoje tickety
        return db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()

# Funkcja do tworzenia nowego zgłoszenia
def create(request: schemas.Ticket, db: Session, current_user: schemas.User):
    new_ticket = models.Ticket(
        title=request.title,  # Tytuł zgłoszenia
        description=request.description,  # Opis zgłoszenia
        user_id=current_user.id  # ID użytkownika tworzącego zgłoszenie
    )
    db.add(new_ticket)  # Dodanie zgłoszenia do sesji bazy danych
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(new_ticket)  # Odświeżenie obiektu zgłoszenia z bazy danych
    return new_ticket  # Zwrócenie nowo utworzonego zgłoszenia

# Funkcja do usuwania zgłoszenia
def delete(id: int, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id)
    
    if not ticket.first():
        # Rzucenie wyjątku, jeśli zgłoszenie nie zostało znalezione
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with id {id} not found')
    
    ticket.delete(synchronize_session=False)  # Usunięcie zgłoszenia
    db.commit()  # Zatwierdzenie zmian w bazie danych
    return 'done'  # Zwrócenie komunikatu o sukcesie

# Funkcja do aktualizacji zgłoszenia
def update(id: int, request: schemas.TicketUpdate, db: Session):
    ticket_query = db.query(models.Ticket).filter(models.Ticket.id == id)
    if not ticket_query.first():
        # Rzucenie wyjątku, jeśli zgłoszenie nie zostało znalezione
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with id {id} not found')

    # Dane do aktualizacji zgłoszenia
    update_data = {
        'status': request.status,  # Status zgłoszenia
        'priority': request.priority,  # Priorytet zgłoszenia
        'assigned_to_id': request.assigned_to,  # ID przypisanego użytkownika
        'estimated_hours': request.estimated_hours,  # Szacowany czas realizacji
        'worked_hours': request.worked_hours,  # Przepracowany czas
        'updated_at': datetime.datetime.now()  # Data ostatniej aktualizacji
    }

    ticket_query.update(update_data, synchronize_session='fetch')  # Aktualizacja zgłoszenia
    db.commit()  # Zatwierdzenie zmian w bazie danych
    return 'updated'  # Zwrócenie komunikatu o sukcesie

# Funkcja do pobierania szczegółów zgłoszenia
def show(id: int, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id).first()
    if not ticket:
        # Rzucenie wyjątku, jeśli zgłoszenie nie zostało znalezione
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with the id {id} is not available')
    return ticket  # Zwrócenie szczegółów zgłoszenia

# Funkcja do ustawiania szacowanego czasu realizacji zgłoszenia
def set_estimated_hours(id: int, hours: float, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id).first()
    if not ticket:
        # Rzucenie wyjątku, jeśli zgłoszenie nie zostało znalezione
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.estimated_hours = hours  # Ustawienie szacowanego czasu realizacji
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(ticket)  # Odświeżenie obiektu zgłoszenia z bazy danych
    return ticket  # Zwrócenie zaktualizowanego zgłoszenia

# Funkcja do dodawania przepracowanych godzin do zgłoszenia
def add_worked_hours(id: int, hours: float, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id).first()
    if not ticket:
        # Rzucenie wyjątku, jeśli zgłoszenie nie zostało znalezione
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.worked_hours is None:
        ticket.worked_hours = 0  # Inicjalizacja przepracowanych godzin, jeśli brak wartości
    ticket.worked_hours += hours  # Dodanie przepracowanych godzin
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(ticket)  # Odświeżenie obiektu zgłoszenia z bazy danych
    return ticket  # Zwrócenie zaktualizowanego zgłoszenia
