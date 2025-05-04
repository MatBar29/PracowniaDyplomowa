from ..hashing import Hash
from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status

# Funkcja do tworzenia nowego użytkownika
def create(request: schemas.User, db: Session):
    # Tworzenie nowego obiektu użytkownika z danymi z żądania
    new_user = models.User(
        name=request.name,  # Imię użytkownika
        email=request.email,  # Adres e-mail użytkownika
        password=Hash.bcrypt(request.password),  # Hashowanie hasła
        role=request.role  # Rola użytkownika
    )
    db.add(new_user)  # Dodanie użytkownika do sesji bazy danych
    db.commit()  # Zatwierdzenie zmian w bazie danych
    db.refresh(new_user)  # Odświeżenie obiektu użytkownika z bazy danych
    return new_user  # Zwrócenie nowo utworzonego użytkownika

# Funkcja do pobierania użytkownika na podstawie ID
def show(id: int, db: Session):
    # Wyszukiwanie użytkownika w bazie danych na podstawie ID
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        # Rzucenie wyjątku, jeśli użytkownik nie został znaleziony
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with id {id} not found'
        )
    return user  # Zwrócenie znalezionego użytkownika

# Funkcja do aktualizacji roli użytkownika na podstawie adresu e-mail
def update(email: str, request: schemas.UserUpdate, db: Session):
    # Wyszukiwanie użytkownika w bazie danych na podstawie adresu e-mail
    user_query = db.query(models.User).filter(models.User.email == email)
    if not user_query.first():
        # Rzucenie wyjątku, jeśli użytkownik nie został znaleziony
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with email {email} not found'
        )

    # Aktualizacja roli użytkownika
    user_query.update({
        'role': request.role  # Nowa rola użytkownika
    }, synchronize_session='fetch')

    db.commit()  # Zatwierdzenie zmian w bazie danych
    return 'updated'  # Zwrócenie komunikatu o sukcesie


