from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    parent_id: UUID | None = None
    sort_order: int = 0


class CategoryResponse(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    slug: str
    description: str | None = None
    parent_id: UUID | None = None
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ArticleCreate(BaseModel):
    category_id: UUID | None = None
    title: str
    slug: str
    content: str
    status: str = "draft"


class ArticleUpdate(BaseModel):
    category_id: UUID | None = None
    title: str | None = None
    slug: str | None = None
    content: str | None = None
    status: str | None = None


class ArticleResponse(BaseModel):
    id: UUID
    business_id: UUID
    category_id: UUID | None = None
    title: str
    slug: str
    content: str
    status: str
    author_id: UUID
    view_count: int
    helpful_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
