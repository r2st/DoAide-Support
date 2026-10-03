from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.knowledge_articles import ArticleStatus, KnowledgeArticle
from app.models.knowledge_categories import KnowledgeCategory
from app.models.users import User
from app.schemas.knowledge import (
    ArticleCreate,
    ArticleResponse,
    ArticleUpdate,
    CategoryCreate,
    CategoryResponse,
)

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.get("/categories", response_model=list[CategoryResponse])
async def list_categories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgeCategory)
        .where(KnowledgeCategory.business_id == current_user.business_id)
        .order_by(KnowledgeCategory.sort_order)
    )
    return result.scalars().all()


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    category = KnowledgeCategory(
        id=uuid4(),
        business_id=current_user.business_id,
        name=data.name,
        slug=data.slug,
        description=data.description,
        parent_id=data.parent_id,
        sort_order=data.sort_order,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgeCategory).where(
            KnowledgeCategory.id == category_id,
            KnowledgeCategory.business_id == current_user.business_id,
        )
    )
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(cat)
    await db.commit()


@router.get("/articles", response_model=list[ArticleResponse])
async def list_articles(
    category_id: UUID | None = None,
    search: str | None = None,
    article_status: str | None = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(KnowledgeArticle).where(KnowledgeArticle.business_id == current_user.business_id)
    if category_id:
        query = query.where(KnowledgeArticle.category_id == category_id)
    if search:
        query = query.where(
            KnowledgeArticle.title.ilike(f"%{search}%") | KnowledgeArticle.content.ilike(f"%{search}%")
        )
    if article_status:
        query = query.where(KnowledgeArticle.status == ArticleStatus(article_status))

    query = query.order_by(KnowledgeArticle.updated_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    data: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    article = KnowledgeArticle(
        id=uuid4(),
        business_id=current_user.business_id,
        category_id=data.category_id,
        title=data.title,
        slug=data.slug,
        content=data.content,
        status=ArticleStatus(data.status),
        author_id=current_user.id,
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article


@router.get("/articles/{slug}", response_model=ArticleResponse)
async def get_article(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgeArticle).where(
            KnowledgeArticle.slug == slug,
            KnowledgeArticle.business_id == current_user.business_id,
        )
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.view_count += 1
    await db.commit()
    await db.refresh(article)
    return article


@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: UUID,
    data: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgeArticle).where(
            KnowledgeArticle.id == article_id,
            KnowledgeArticle.business_id == current_user.business_id,
        )
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    for field in ("category_id", "title", "slug", "content"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(article, field, val)
    if data.status is not None:
        article.status = ArticleStatus(data.status)

    await db.commit()
    await db.refresh(article)
    return article


@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgeArticle).where(
            KnowledgeArticle.id == article_id,
            KnowledgeArticle.business_id == current_user.business_id,
        )
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.delete(article)
    await db.commit()


@router.post("/articles/{article_id}/helpful")
async def mark_helpful(article_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KnowledgeArticle).where(KnowledgeArticle.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.helpful_count += 1
    await db.commit()
    return {"helpful_count": article.helpful_count}
