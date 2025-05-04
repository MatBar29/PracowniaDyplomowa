from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Response, status
from jose import JWTError, jwt

# Klucz tajny używany do podpisywania tokenów JWT
SECRET_KEY = "09d225e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

# Algorytm używany do kodowania i dekodowania tokenów JWT
ALGORITHM = "HS256"

# Czas wygaśnięcia tokenu dostępu w minutach
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Funkcja do tworzenia tokenu dostępu (JWT)
def create_access_token(response: Response, data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()  # Kopiowanie danych do zakodowania w tokenie
    if expires_delta:
        expire = datetime.utcnow() + expires_delta  # Ustawienie czasu wygaśnięcia na podstawie podanego okresu
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Domyślny czas wygaśnięcia
    to_encode.update({"exp": expire})  # Dodanie czasu wygaśnięcia do danych

    # Kodowanie danych do tokenu JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Ustawienie tokenu w ciasteczku HTTP-only
    response.set_cookie(
        key="jwt_token", 
        value=encoded_jwt, 
        httponly=True,  # Ciasteczko dostępne tylko przez HTTP (niedostępne dla JavaScript)
        secure=False,  # Ustawienie na True w środowisku produkcyjnym (HTTPS)
        samesite="Strict",  # Polityka SameSite dla ciasteczka
        max_age=expires_delta  # Czas życia ciasteczka
    )

    return encoded_jwt  # Zwrócenie zakodowanego tokenu

# Funkcja do weryfikacji tokenu JWT
def verify_token(token: str, credentials_exception: HTTPException):
    try:
        # Dekodowanie tokenu JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: int = payload.get("id")  # Pobranie ID użytkownika z tokenu
        if id is None:
            raise credentials_exception  # Rzucenie wyjątku, jeśli ID nie istnieje
        return id  # Zwrócenie ID użytkownika
    except JWTError:
        # Rzucenie wyjątku w przypadku błędu dekodowania tokenu
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )