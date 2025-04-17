import datetime
from pydantic import BaseModel
from typing import List, Optional
from .enum_schemas import StatusEnum, PriorityEnum, RoleEnum


class Ticket(BaseModel):
    title: str
    description: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    estimated_hours: Optional[float] = None
    worked_hours: Optional[float] = 0.0

    class Config:
        orm_mode = True

class TicketUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    assigned_to: Optional[int] = None
    estimated_hours: Optional[float] = None
    worked_hours: Optional[float] = None
    updated_at: Optional[datetime.datetime] = None

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
    id: int
    name: str
    email: str
    role: RoleEnum

    class Config:
        orm_mode = True

class ShowCommentT(BaseModel):
    comment:str
    created_at: datetime.datetime
    user: ShowUserT

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
    comments: List[ShowCommentT]
    estimated_hours: Optional[float] = None
    worked_hours: Optional[float] = None

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

class ShowComment(BaseModel):
    comment_id: int
    comment: str
    created_at: datetime.datetime
    user: ShowUserT
    ticket_id: int

    class Config:
        orm_mode = True

class CreateComment(BaseModel):
    comment: str
    ticket_id: int

    class Config:
        orm_mode = True

class AttachmentBase(BaseModel):
    filename: str
    filepath: str

    class Config:
        orm_mode = True

class CreateAttachment(BaseModel):
    ticket_id: int

class ShowAttachment(AttachmentBase):
    id: int
    uploaded_at: datetime.datetime

class EstimateHours(BaseModel):
    estimated_hours: float

class AddWorkedHours(BaseModel):
    worked_hours: float
