from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ChatSessionCreate(BaseModel):
    customer_id: UUID
    ticket_id: UUID | None = None


class ChatSessionResponse(BaseModel):
    id: UUID
    business_id: UUID
    customer_id: UUID
    ticket_id: UUID | None = None
    agent_id: UUID | None = None
    status: str
    started_at: datetime
    ended_at: datetime | None = None

    model_config = {"from_attributes": True}


class ChatMessageSchema(BaseModel):
    session_id: UUID
    sender_type: str
    sender_id: UUID | None = None
    body: str
    timestamp: datetime | None = None
