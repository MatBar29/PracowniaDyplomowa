from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Response, status
from jose import JWTError, jwt


SECRET_KEY = "09d225e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(response: Response, data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    # Umieszczanie tokena w ciasteczku
    response.set_cookie(
    key="jwt_token", 
    value=encoded_jwt, 
    httponly=True, 
    secure=True,  # Używaj tylko w połączeniu HTTPS
    samesite="Strict",  # W zależności od potrzeb możesz użyć "Lax" lub "Strict"
    max_age=expires_delta
)
    
    return encoded_jwt

def verify_token(token: str, credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: int = payload.get("id")
        if id is None:
            raise credentials_exception
        return id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )