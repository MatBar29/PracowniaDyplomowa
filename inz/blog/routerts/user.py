from fastapi import APIRouter, Depends, status
from blog.oauth2 import is_admin
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

@router.put('/{email}', status_code=status.HTTP_202_ACCEPTED)
def update(email: str, request: schemas.UserUpdate , db: Session = Depends(get_db), usera=Depends(is_admin)):
    return user.update(email, request, db)