from typing import List
from fastapi import APIRouter, Depends, File, UploadFile
from .. import schemas, database
from sqlalchemy.orm import Session
from ..oauth2 import get_current_user
from ..repository import attachment

router = APIRouter(tags=['attachments'])


@router.post('/{id}/attachments', response_model=schemas.ShowAttachment)
def upload_attachment(
    id: int,
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return attachment.create_attachment(ticket_id=id, file=file, db=db)

@router.get('/{id}/attachments', response_model=List[schemas.ShowAttachment])
def get_attachments(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return attachment.get_attachments(ticket_id=id, db=db)
