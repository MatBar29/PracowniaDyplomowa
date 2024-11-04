import enum


class StatusEnum(enum.Enum):
    new = "new"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class PriorityEnum(enum.Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'

class RoleEnum(enum.Enum):
    admin = 'admin'
    user = 'user'
    service = 'service'
    menager = 'menager'