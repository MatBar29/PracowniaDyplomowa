from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from blog import models
from blog.database import engine
from blog.routerts import ticket, user, auth, comment, attachment
from fastapi.middleware.cors import CORSMiddleware

from blog.oauth2 import get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,  # pozwala na przesyłanie ciasteczek
    allow_methods=["*"],  # pozwala na wszystkie metody HTTP
    allow_headers=["*"],  # pozwala na wszystkie nagłówki
)


models.Base.metadata.create_all(engine)

app.include_router(ticket.router)
app.include_router(comment.router)
app.include_router(attachment.router)
app.include_router(user.router)
app.include_router(auth.router)



app.mount("/attachments", StaticFiles(directory="blog/attachments"), name="attachments")
