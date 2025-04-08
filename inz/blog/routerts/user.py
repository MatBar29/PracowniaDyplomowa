from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy import or_
from blog.oauth2 import get_current_user, is_admin
from blog import models
from blog.enum_models import RoleEnum
from .. import database, schemas
from sqlalchemy.orm import Session
from ..repository import user


router = APIRouter(tags=['users'],prefix='/user')

get_db = database.get_db

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=schemas.ShowUser)
def create(request: schemas.User, db: Session = Depends(get_db)):
    return user.create(request, db)

@router.get('/{id}',response_model=schemas.ShowUser)
def show(id: int, db: Session = Depends(get_db)):
    return user.show(id, db)

@router.get('/', response_model=List[schemas.ShowUser])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.put('/{email}', status_code=status.HTTP_202_ACCEPTED)
def update(email: str, request: schemas.UserUpdate , db: Session = Depends(get_db), usera=Depends(is_admin)):
    return user.update(email, request, db)

@router.get('/service/', response_model=List[schemas.ShowUser])
def get_service_and_admin_users(db: Session = Depends(get_db)):
    return db.query(models.User).filter(
        or_(
            models.User.role == RoleEnum.admin,
            models.User.role == RoleEnum.service
        )
    ).all()

@router.get("/status/", response_model=schemas.User)
def get_user_status(user: models.User = Depends(get_current_user)):
    return user  # Zwracamy pełne dane użytkownika