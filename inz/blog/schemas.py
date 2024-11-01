from pydantic import BaseModel
from typing import List, Optional
from .enum_schemas import StatusEnum, PriorityEnum

class Ticket(BaseModel):
    title: str
    description: str

    class Config:
        orm_mode = True

class TicketUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    assigned_to: Optional[int] = None

class User(BaseModel):
    name: str
    email: str
    password: str

class ShowUser(BaseModel):
    name: str
    email: str
    tickets: List[Ticket] = []

    class Config:
        orm_mode = True

class ShowUserT(BaseModel):
    name: str
    email: str

    class Config:
        orm_mode = True

class ShowTicket(BaseModel):
    title: str
    description: str
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    creator: ShowUserT
    assigned_to: Optional[ShowUserT] = None

    class Config:
        orm_mode = True

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int
    email: Optional[str] = None
