from http.client import HTTPException
from fastapi import APIRouter, Depends, status, Response
from blog.enum_models import RoleEnum
from .. import schemas, database
from typing import List
from sqlalchemy.orm import Session
from ..repository import ticket
from ..oauth2 import get_current_user, is_admin

router = APIRouter(tags=['tickets'], prefix='/ticket')

@router.get("/")
def get_tickets(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    tickets = ticket.get_all(db, current_user)
    return tickets  # Zwracaj dane w odpowiedzi

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Ticket, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return ticket.create(request, db, current_user)  # Pass current_user here

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user), user=Depends(is_admin)):
    return ticket.delete(id, db)

@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id: int, request: schemas.TicketUpdate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user), user=Depends(is_admin)):
    return ticket.update(id, request, db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowTicket)
def show(id: int, response: Response, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return ticket.show(id, db)

@router.put("/{id}/estimate", status_code=status.HTTP_200_OK)
def estimate_hours(id: int, data: schemas.EstimateHours, db: Session = Depends(database.get_db), user=Depends(is_admin)):
    return ticket.set_estimated_hours(id, data.estimated_hours, db)


@router.put("/{id}/log-time", status_code=status.HTTP_200_OK)
def log_worked_hours(id: int, data: schemas.AddWorkedHours, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    if current_user.role != RoleEnum.service:
        raise HTTPException(status_code=403, detail="Brak dostępu")
    return ticket.add_worked_hours(id, data.worked_hours, db)

