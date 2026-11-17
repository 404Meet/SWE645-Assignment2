
# Starts the FastAPI application and initializes the SQLModel database tables.

from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine
from app.models import Survey
from app.routes.surveys import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(
    title="SWE 645 Student Survey API",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
