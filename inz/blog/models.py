from sqlalchemy import Column, Integer, String, ForeignKey, Enum
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

    user_id = Column(Integer, ForeignKey('users.id'))
    creator = relationship("User", foreign_keys=[user_id], back_populates="tickets_created")

    assigned_to_id = Column(Integer, ForeignKey('users.id'), nullable = True)
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="tickets_assigned")


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    role = Column(Enum(RoleEnum), default='user')

    tickets_created = relationship('Ticket', foreign_keys=[Ticket.user_id], back_populates="creator", cascade="all, delete-orphan")
    tickets_assigned = relationship('Ticket', foreign_keys=[Ticket.assigned_to_id], back_populates="assigned_to")
