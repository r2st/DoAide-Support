from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    email: EmailStr
    name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    metadata: dict = {}


class CustomerUpdate(BaseModel):
    email: EmailStr | None = None
    name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    metadata: dict | None = None


class CustomerResponse(BaseModel):
    id: UUID
    business_id: UUID
    email: str
    name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    metadata_: dict = {}
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
