from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TicketCreate(BaseModel):
    customer_id: UUID
    subject: str
    priority: str = "medium"
    channel: str = "web"
    tags: list[str] = []
    body: str


class TicketUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    assigned_to: UUID | None = None
    tags: list[str] | None = None
    sla_policy_id: UUID | None = None


class MessageCreate(BaseModel):
    body: str
    sender_type: str = "agent"
    is_internal: bool = False
    attachments: list[dict] = []


class MessageResponse(BaseModel):
    id: UUID
    ticket_id: UUID
    sender_type: str
    sender_id: UUID | None = None
    body: str
    attachments: list[dict] = []
    is_internal: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketResponse(BaseModel):
    id: UUID
    business_id: UUID
    customer_id: UUID
    assigned_to: UUID | None = None
    subject: str
    status: str
    priority: str
    tags: list[str] = []
    channel: str
    sla_policy_id: UUID | None = None
    first_response_at: datetime | None = None
    resolved_at: datetime | None = None
    satisfaction_rating: int | None = None
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse] = []

    model_config = {"from_attributes": True}


class TicketListResponse(BaseModel):
    tickets: list[TicketResponse]
    total: int
    page: int
    per_page: int
