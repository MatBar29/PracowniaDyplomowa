from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from .. import database, models, token
from sqlalchemy.orm import Session
from ..hashing import Hash

router = APIRouter(tags=['auth'], prefix='/login')

@router.post('/')
def login(response: Response, request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # Sprawdzenie, czy użytkownik istnieje
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Invalid credentials')
    
    # Sprawdzenie poprawności hasła
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Invalid credentials')

    # Utworzenie tokenu i zapisanie go w ciasteczku
    access_token = token.create_access_token(response=response, data={"sub": user.email, "id": user.id})

    # Zapisanie tokenu w ciasteczku (to już robi funkcja `create_access_token`)
    return {"message": "Login successful"}


@router.post('/logout')
def logout(response: Response):
    # Usuwanie tokena z ciasteczka przez ustawienie pustej wartości i daty wygaśnięcia w przeszłości
    response.set_cookie(key="jwt_token", value="", expires=0)
    return {"message": "Logout successful"}


