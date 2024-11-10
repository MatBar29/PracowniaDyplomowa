from fastapi import FastAPI
from blog import models
from blog.database import engine
from blog.routerts import ticket, user, auth, comment

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(ticket.router)
app.include_router(comment.router)
app.include_router(user.router)
app.include_router(auth.router)
