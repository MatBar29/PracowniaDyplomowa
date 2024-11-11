from fastapi import APIRouter, Depends, status
from .. import schemas, database
from typing import List
from sqlalchemy.orm import Session
from ..repository import comment
from ..oauth2 import get_current_user, is_admin

router = APIRouter(tags=['comments'], prefix='/comment')

@router.get('/', response_model=List[schemas.ShowComment])
def all(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return comment.get_all(db)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: schemas.CreateComment, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(get_current_user)):
    return comment.create(request, db, current_user)