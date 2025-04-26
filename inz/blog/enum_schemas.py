from enum import Enum


class StatusEnum(str, Enum):
    new = "new"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class PriorityEnum(str, Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'

class RoleEnum(str, Enum):
    admin = 'admin'
    user = 'user'
    service = 'service'