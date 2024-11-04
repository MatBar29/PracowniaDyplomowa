import datetime
from pydantic import BaseModel
from typing import List, Optional
from .enum_schemas import StatusEnum, PriorityEnum, RoleEnum

class Ticket(BaseModel):
    title: str
    description: str
    created_at: Optional[datetime.datetime] = datetime.datetime.now
    updated_at: Optional[datetime.datetime] = datetime.datetime.now

    class Config:
        orm_mode = True

class TicketUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    assigned_to: Optional[int] = None
    updated_at: Optional[datetime.datetime] = datetime.datetime.now

class User(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[RoleEnum] = 'user'

    class Config:
        orm_mode = True

class ShowUser(BaseModel):
    name: str
    email: str
    tickets: List[Ticket] = []
    role: Optional[RoleEnum] = None

    class Config:
        orm_mode = True

class ShowUserT(BaseModel):
    name: str
    email: str
    role: Optional[RoleEnum] = 'user'

    class Config:
        orm_mode = True

class ShowTicket(BaseModel):
    title: str
    description: str
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    creator: ShowUserT
    assigned_to: Optional[ShowUserT] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    role: Optional[RoleEnum] = None

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int
    email: Optional[str] = None
    role: Optional[RoleEnum] = 'user'

    class Config:
        orm_mode = True
