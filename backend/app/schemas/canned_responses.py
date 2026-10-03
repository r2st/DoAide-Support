from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CannedResponseCreate(BaseModel):
    title: str
    content: str
    shortcut: str | None = None
    category: str | None = None


class CannedResponseUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    shortcut: str | None = None
    category: str | None = None


class CannedResponseResponse(BaseModel):
    id: UUID
    business_id: UUID
    title: str
    content: str
    shortcut: str | None = None
    category: str | None = None
    created_by: UUID
    use_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
