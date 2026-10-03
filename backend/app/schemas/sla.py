from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SLAPolicyCreate(BaseModel):
    name: str
    priority: str
    first_response_hours: float
    resolution_hours: float


class SLAPolicyUpdate(BaseModel):
    name: str | None = None
    priority: str | None = None
    first_response_hours: float | None = None
    resolution_hours: float | None = None
    is_active: bool | None = None


class SLAPolicyResponse(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    priority: str
    first_response_hours: float
    resolution_hours: float
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
