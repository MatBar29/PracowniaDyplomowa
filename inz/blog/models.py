import datetime
from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Enum, Float
from .database import Base
from sqlalchemy.orm import relationship
from .enum_models import StatusEnum, PriorityEnum, RoleEnum

# Model dla zgłoszeń (tickets)
class Ticket(Base):
    __tablename__ = 'tickets'

    id = Column(Integer, primary_key=True, index=True)  # Unikalny identyfikator zgłoszenia
    title = Column(String)  # Tytuł zgłoszenia
    description = Column(String)  # Opis zgłoszenia
    status = Column(Enum(StatusEnum), default='new')  # Status zgłoszenia (np. nowy, w trakcie, zakończony)
    priority = Column(Enum(PriorityEnum), nullable=True)  # Priorytet zgłoszenia (np. niski, średni, wysoki)
    created_at = Column(DateTime, default=datetime.datetime.now())  # Data utworzenia zgłoszenia
    updated_at = Column(DateTime, default=datetime.datetime.now())  # Data ostatniej aktualizacji zgłoszenia
    estimated_hours = Column(Float, nullable=True)  # Szacowany czas realizacji zgłoszenia
    worked_hours = Column(Float, default=0.0)  # Przepracowany czas dla zgłoszenia

    user_id = Column(Integer, ForeignKey('users.id'))  # ID użytkownika, który utworzył zgłoszenie
    creator = relationship("User", foreign_keys=[user_id], back_populates="tickets_created")  # Relacja do użytkownika tworzącego zgłoszenie
    assigned_to_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # ID użytkownika przypisanego do zgłoszenia
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="tickets_assigned")  # Relacja do przypisanego użytkownika
    comments = relationship('Comment', back_populates="ticket", cascade="all, delete-orphan")  # Relacja do komentarzy powiązanych ze zgłoszeniem
    attachments = relationship('Attachment', back_populates="ticket", cascade="all, delete-orphan")  # Relacja do załączników powiązanych ze zgłoszeniem

# Model dla użytkowników (users)
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)  # Unikalny identyfikator użytkownika
    name = Column(String)  # Imię użytkownika
    email = Column(String)  # Adres e-mail użytkownika
    password = Column(String)  # Hasło użytkownika (zahashowane)
    role = Column(Enum(RoleEnum), default='user')  # Rola użytkownika (np. admin, service, user)

    tickets_created = relationship('Ticket', foreign_keys=[Ticket.user_id], back_populates="creator", cascade="all, delete-orphan")  # Relacja do zgłoszeń utworzonych przez użytkownika
    tickets_assigned = relationship('Ticket', foreign_keys=[Ticket.assigned_to_id], back_populates="assigned_to")  # Relacja do zgłoszeń przypisanych do użytkownika
    comments = relationship('Comment', back_populates="user", cascade="all, delete-orphan")  # Relacja do komentarzy użytkownika

# Model dla komentarzy (comments)
class Comment(Base):
    __tablename__ = 'comments'
    
    comment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Unikalny identyfikator komentarza
    ticket_id = Column(Integer, ForeignKey('tickets.id'))  # ID zgłoszenia, do którego należy komentarz
    user_id = Column(Integer, ForeignKey('users.id'))  # ID użytkownika, który dodał komentarz
    comment = Column(String)  # Treść komentarza
    created_at = Column(DateTime, default=datetime.datetime.now())  # Data utworzenia komentarza

    ticket = relationship("Ticket", back_populates="comments")  # Relacja do zgłoszenia, do którego należy komentarz
    user = relationship("User", back_populates="comments")  # Relacja do użytkownika, który dodał komentarz

# Model dla załączników (attachments)
class Attachment(Base):
    __tablename__ = 'attachments'
    
    id = Column(Integer, primary_key=True, index=True)  # Unikalny identyfikator załącznika
    filename = Column(String, nullable=False)  # Nazwa pliku załącznika
    filepath = Column(String, nullable=False)  # Ścieżka do pliku załącznika
    uploaded_at = Column(DateTime, default=datetime.datetime.now())  # Data przesłania załącznika
    ticket_id = Column(Integer, ForeignKey('tickets.id'))  # ID zgłoszenia, do którego należy załącznik

    ticket = relationship("Ticket", back_populates="attachments")  # Relacja do zgłoszenia, do którego należy załącznik