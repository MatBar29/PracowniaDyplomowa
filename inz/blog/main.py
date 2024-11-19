from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from blog import models
from blog.database import engine
from blog.routerts import ticket, user, auth, comment, attachment

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(ticket.router)
app.include_router(comment.router)
app.include_router(attachment.router)
app.include_router(user.router)
app.include_router(auth.router)

app.mount("/attachments", StaticFiles(directory="blog/attachments"), name="attachments")
