from fastapi import APIRouter, Depends, status, Response
from .. import schemas, database
from typing import List
from sqlalchemy.orm import Session
from ..repository import ticket
from ..oauth2 import get_current_user, is_admin

router = APIRouter(tags=['tickets'], prefix='/ticket')

@router.get('/', response_model=List[schemas.ShowTicket])
def all(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return ticket.get_all(db)

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
