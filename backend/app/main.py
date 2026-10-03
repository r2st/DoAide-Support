from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import (
    ai,
    auth,
    canned_responses,
    chat,
    customers,
    email_router,
    health,
    knowledge,
    portal,
    reports,
    sla,
    tickets,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(title="DoAide Support", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(canned_responses.router, prefix="/api")
app.include_router(sla.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(email_router.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(portal.router, prefix="/api")
