import datetime
from pydantic import BaseModel
from typing import List, Optional
from .enum_schemas import StatusEnum, PriorityEnum, RoleEnum

# Schemat dla zgłoszenia (Ticket)
class Ticket(BaseModel):
    title: str  # Tytuł zgłoszenia
    description: str  # Opis zgłoszenia
    created_at: Optional[datetime.datetime] = None  # Data utworzenia zgłoszenia
    updated_at: Optional[datetime.datetime] = None  # Data ostatniej aktualizacji zgłoszenia
    estimated_hours: Optional[float] = None  # Szacowany czas realizacji zgłoszenia
    worked_hours: Optional[float] = 0.0  # Przepracowany czas dla zgłoszenia

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla aktualizacji zgłoszenia
class TicketUpdate(BaseModel):
    status: Optional[StatusEnum] = None  # Status zgłoszenia
    priority: Optional[PriorityEnum] = None  # Priorytet zgłoszenia
    assigned_to: Optional[int] = None  # ID przypisanego użytkownika
    estimated_hours: Optional[float] = None  # Szacowany czas realizacji
    worked_hours: Optional[float] = None  # Przepracowany czas
    updated_at: Optional[datetime.datetime] = None  # Data ostatniej aktualizacji

# Schemat dla użytkownika (User)
class User(BaseModel):
    name: str  # Imię użytkownika
    email: str  # Adres e-mail użytkownika
    password: str  # Hasło użytkownika
    role: Optional[RoleEnum] = 'user'  # Rola użytkownika (domyślnie 'user')

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla wyświetlania użytkownika
class ShowUser(BaseModel):
    name: str  # Imię użytkownika
    email: str  # Adres e-mail użytkownika
    tickets: List[Ticket] = []  # Lista zgłoszeń użytkownika
    role: Optional[RoleEnum] = None  # Rola użytkownika

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla uproszczonego wyświetlania użytkownika
class ShowUserT(BaseModel):
    id: int  # ID użytkownika
    name: str  # Imię użytkownika
    email: str  # Adres e-mail użytkownika
    role: RoleEnum  # Rola użytkownika

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla komentarza (uproszczony)
class ShowCommentT(BaseModel):
    comment: str  # Treść komentarza
    created_at: datetime.datetime  # Data utworzenia komentarza
    user: ShowUserT  # Dane użytkownika, który dodał komentarz

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla wyświetlania zgłoszenia
class ShowTicket(BaseModel):
    title: str  # Tytuł zgłoszenia
    description: str  # Opis zgłoszenia
    status: Optional[StatusEnum] = None  # Status zgłoszenia
    priority: Optional[PriorityEnum] = None  # Priorytet zgłoszenia
    creator: ShowUserT  # Dane użytkownika, który utworzył zgłoszenie
    assigned_to: Optional[ShowUserT] = None  # Dane przypisanego użytkownika
    created_at: datetime.datetime  # Data utworzenia zgłoszenia
    updated_at: datetime.datetime  # Data ostatniej aktualizacji zgłoszenia
    comments: List[ShowCommentT]  # Lista komentarzy powiązanych ze zgłoszeniem
    estimated_hours: Optional[float] = None  # Szacowany czas realizacji
    worked_hours: Optional[float] = None  # Przepracowany czas

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla aktualizacji użytkownika
class UserUpdate(BaseModel):
    role: Optional[RoleEnum] = None  # Nowa rola użytkownika

# Schemat dla logowania
class Login(BaseModel):
    username: str  # Nazwa użytkownika (e-mail)
    password: str  # Hasło użytkownika

# Schemat dla tokenu autoryzacyjnego
class Token(BaseModel):
    access_token: str  # Token dostępu
    token_type: str  # Typ tokenu (np. Bearer)

# Schemat dla danych tokenu
class TokenData(BaseModel):
    id: int  # ID użytkownika
    email: Optional[str] = None  # Adres e-mail użytkownika
    role: Optional[RoleEnum] = 'user'  # Rola użytkownika

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla wyświetlania komentarza
class ShowComment(BaseModel):
    comment_id: int  # ID komentarza
    comment: str  # Treść komentarza
    created_at: datetime.datetime  # Data utworzenia komentarza
    user: ShowUserT  # Dane użytkownika, który dodał komentarz
    ticket_id: int  # ID zgłoszenia, do którego należy komentarz

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla tworzenia komentarza
class CreateComment(BaseModel):
    comment: str  # Treść komentarza
    ticket_id: int  # ID zgłoszenia, do którego należy komentarz

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat bazowy dla załącznika
class AttachmentBase(BaseModel):
    filename: str  # Nazwa pliku załącznika
    filepath: str  # Ścieżka do pliku załącznika

    class Config:
        orm_mode = True  # Umożliwia konwersję z obiektów ORM

# Schemat dla tworzenia załącznika
class CreateAttachment(BaseModel):
    ticket_id: int  # ID zgłoszenia, do którego należy załącznik

# Schemat dla wyświetlania załącznika
class ShowAttachment(AttachmentBase):
    id: int  # ID załącznika
    uploaded_at: datetime.datetime  # Data przesłania załącznika

# Schemat dla ustawiania szacowanego czasu realizacji
class EstimateHours(BaseModel):
    estimated_hours: float  # Szacowany czas realizacji w godzinach

# Schemat dla logowania przepracowanych godzin
class AddWorkedHours(BaseModel):
    worked_hours: float  # Liczba przepracowanych godzin
