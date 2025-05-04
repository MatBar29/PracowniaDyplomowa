from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from blog import models
from blog.database import engine
from blog.routerts import ticket, user, auth, comment, attachment
from fastapi.middleware.cors import CORSMiddleware

from blog.oauth2 import get_current_user

# Tworzenie instancji aplikacji FastAPI
app = FastAPI()

# Konfiguracja middleware CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adres frontend-u, który ma dostęp do API
    allow_credentials=True,  # Pozwala na przesyłanie ciasteczek
    allow_methods=["*"],  # Pozwala na wszystkie metody HTTP (GET, POST, PUT, DELETE, itp.)
    allow_headers=["*"],  # Pozwala na wszystkie nagłówki HTTP
)

# Tworzenie tabel w bazie danych na podstawie modeli ORM
models.Base.metadata.create_all(engine)

# Rejestrowanie routerów dla różnych modułów aplikacji
app.include_router(ticket.router)  # Router dla obsługi zgłoszeń
app.include_router(comment.router)  # Router dla obsługi komentarzy
app.include_router(attachment.router)  # Router dla obsługi załączników
app.include_router(user.router)  # Router dla obsługi użytkowników
app.include_router(auth.router)  # Router dla obsługi autoryzacji

# Montowanie statycznych plików (np. załączników) w aplikacji
app.mount("/attachments", StaticFiles(directory="blog/attachments"), name="attachments")
