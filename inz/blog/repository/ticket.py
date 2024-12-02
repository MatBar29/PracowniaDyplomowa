from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models, schemas

def get_all(db: Session, current_user: schemas.User):
    if current_user.role == 'admin' or current_user.role == 'manager':
        # Admin/Manager widzi wszystkie tickety
        return db.query(models.Ticket).all()
    elif current_user.role == 'service':
        # Service widzi tickety przypisane do niego i te, które stworzył
        return db.query(models.Ticket).filter(
            (models.Ticket.user_id == current_user.id) |
            (models.Ticket.assigned_to_id == current_user.id)
        ).all()
    else:
        # Zwykły użytkownik widzi tylko swoje tickety
        return db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()


def create(request: schemas.Ticket, db: Session, current_user: schemas.User):
    new_ticket = models.Ticket(
        title=request.title,
        description=request.description,
        user_id=current_user.id  # Użycie current_user.id
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

def delete(id: int, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id)
    
    if not ticket.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with id {id} not found')
    
    ticket.delete(synchronize_session=False)
    db.commit()
    return 'done'

def update(id: int, request: schemas.TicketUpdate, db: Session):
    ticket_query = db.query(models.Ticket).filter(models.Ticket.id == id)

    if not ticket_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with id {id} not found')

    # Użycie only those fields that should be updated
    ticket_query.update({
        'status': request.status,
        'priority': request.priority,
        'assigned_to_id': request.assigned_to  # Użyj assigned_to_id
    }, synchronize_session='fetch')

    db.commit()
    return 'updated'



def show(id: int, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Ticket with the id {id} is not available')
    return ticket
