from ..hashing import Hash
from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status

def create(request: schemas.User, db: Session):
    new_user = models.User(name=request.name, email=request.email, password=Hash.bcrypt(request.password), role=request.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def show(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id {id} not found')
    return user

def update(email: str, request: schemas.UserUpdate, db: Session):
    user_query = db.query(models.User).filter(models.User.email == email)
    if not user_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id {id} not found')
    
    user_query.update({
        'role': request.role
    }, synchronize_session='fetch')

    db.commit()
    return 'updated'
def update(email: str, request: schemas.UserUpdate, db: Session):
    user_query = db.query(models.User).filter(models.User.email == email)
    if not user_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with id {id} not found')
    
    user_query.update({
        'role': request.role
    }, synchronize_session='fetch')

    db.commit()
    return 'updated'
