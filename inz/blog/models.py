import datetime
from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Enum
from .database import Base
from sqlalchemy.orm import relationship
from .enum_models import StatusEnum, PriorityEnum, RoleEnum


class Ticket(Base):
    __tablename__ = 'tickets'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    status = Column(Enum(StatusEnum), default='new')
    priority = Column(Enum(PriorityEnum), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, default=datetime.datetime.now())

    user_id = Column(Integer, ForeignKey('users.id'))
    creator = relationship("User", foreign_keys=[user_id], back_populates="tickets_created")

    assigned_to_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="tickets_assigned")

    comments = relationship('Comment', back_populates="ticket", cascade="all, delete-orphan")



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    role = Column(Enum(RoleEnum), default='user')

    tickets_created = relationship('Ticket', foreign_keys=[Ticket.user_id], back_populates="creator", cascade="all, delete-orphan")
    tickets_assigned = relationship('Ticket', foreign_keys=[Ticket.assigned_to_id], back_populates="assigned_to")

    comments = relationship('Comment', back_populates="user", cascade="all, delete-orphan")



class Comment(Base):
    __tablename__ = 'comments'
    
    comment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now())

    ticket = relationship("Ticket", back_populates="comments")
    user = relationship("User", back_populates="comments")