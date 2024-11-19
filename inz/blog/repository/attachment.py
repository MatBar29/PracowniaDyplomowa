from fastapi import UploadFile
import shutil
from sqlalchemy.orm import Session
from .. import models

def create_attachment(ticket_id: int, file: UploadFile, db: Session):
    file_location = f"blog/attachments/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_attachment = models.Attachment(
        filename=file.filename,
        filepath=file_location,
        ticket_id=ticket_id
    )
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    return new_attachment

def get_attachments(id: int, db: Session):
    return db.query(models.Attachment).filter(models.Attachment.id == id).all()
