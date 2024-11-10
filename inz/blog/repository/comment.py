from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .. import models, schemas

def get_all(db: Session):
    return db.query(models.Comment).all()

def create(request:schemas.CreateComment, db: Session, current_user: schemas.User):
    new_comment = models.Comment(
        ticket_id = request.ticket_id,
        comment = request.comment,
        user_id = current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment