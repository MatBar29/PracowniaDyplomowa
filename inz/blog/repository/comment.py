from sqlalchemy.orm import Session
from .. import models, schemas

# Funkcja do pobierania wszystkich komentarzy
def get_all(db: Session):
    # Pobranie wszystkich komentarzy z bazy danych
    return db.query(models.Comment).all()

# Funkcja do tworzenia nowego komentarza
def create(request: schemas.CreateComment, db: Session, current_user: schemas.User):
    # Tworzenie nowego obiektu komentarza z danymi z żądania
    new_comment = models.Comment(
        ticket_id=request.ticket_id,  # ID zgłoszenia, do którego należy komentarz
        comment=request.comment,  # Treść komentarza
        user_id=current_user.id  # ID użytkownika, który dodał komentarz
    )
    db.add(new_comment)  # Dodanie komentarza do sesji bazy danych
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(new_comment)  # Odświeżenie obiektu komentarza z bazy danych
    return new_comment  # Zwrócenie nowo utworzonego komentarza