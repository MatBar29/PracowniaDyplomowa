from passlib.context import CryptContext

# Kontekst kryptograficzny z użyciem algorytmu bcrypt
pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Klasa do obsługi hashowania haseł
class Hash():
    # Funkcja do hashowania hasła
    def bcrypt(password: str):
        return pwd_cxt.hash(password)  # Zwraca zahashowane hasło
    
    # Funkcja do weryfikacji hasła
    def verify(hashed_password, plain_password):
        return pwd_cxt.verify(plain_password, hashed_password)  # Sprawdza, czy hasło jest poprawne
