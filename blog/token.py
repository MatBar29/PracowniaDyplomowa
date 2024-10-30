from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from .schemas import TokenData


SECRET_KEY = "09d225e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Use the constant you defined
    to_encode.update({"exp": expire})
    # Make sure to include user ID in the token data
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("id")  # Extract user ID

        if email is None or user_id is None:  # Check both fields
            raise credentials_exception
            
        # Create TokenData with both email and ID
        token_data = TokenData(id=user_id, email=email)
        
        return token_data
        
    except JWTError:
        raise credentials_exception

