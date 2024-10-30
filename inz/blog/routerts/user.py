from fastapi import APIRouter, Depends, status, HTTPException
from .. import database, schemas, models
from ..hashing import Hash
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