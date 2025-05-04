from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ścieżka do bazy danych SQLite
SQLALCHEMY_DATABASE_URL = 'sqlite:///./ticket.db'

# Tworzenie silnika bazy danych z ustawieniem dla SQLite
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Konfiguracja sesji bazy danych
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Tworzenie klasy bazowej dla modeli ORM
Base = declarative_base()

# Funkcja do uzyskiwania sesji bazy danych
def get_db():
    db = SessionLocal()  # Utworzenie nowej sesji
    try:
        yield db  # Zwrócenie sesji
    finally:
        db.close()  # Zamknięcie sesji po zakończeniu pracy