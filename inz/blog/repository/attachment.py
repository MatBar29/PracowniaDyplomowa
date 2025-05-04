from fastapi import UploadFile
import shutil
from sqlalchemy.orm import Session
from .. import models

# Funkcja do tworzenia nowego załącznika
def create_attachment(ticket_id: int, file: UploadFile, db: Session):
    # Ścieżka, w której zostanie zapisany plik
    file_location = f"blog/attachments/{file.filename}"
    
    # Zapis pliku na serwerze
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Tworzenie nowego obiektu załącznika
    new_attachment = models.Attachment(
        filename=file.filename,  # Nazwa pliku
        filepath=file_location,  # Ścieżka do pliku
        ticket_id=ticket_id  # ID zgłoszenia, do którego należy załącznik
    )
    db.add(new_attachment)  # Dodanie załącznika do sesji bazy danych
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(new_attachment)  # Odświeżenie obiektu załącznika z bazy danych
    return new_attachment  # Zwrócenie nowo utworzonego załącznika

# Funkcja do pobierania załączników dla zgłoszenia
def get_attachments(ticket_id: int, db: Session):
    # Pobranie wszystkich załączników powiązanych z danym zgłoszeniem
    return db.query(models.Attachment).filter(models.Attachment.ticket_id == ticket_id).all()

