from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.canned_responses import CannedResponse
from app.models.users import User
from app.schemas.canned_responses import (
    CannedResponseCreate,
    CannedResponseResponse,
    CannedResponseUpdate,
)

router = APIRouter(prefix="/canned-responses", tags=["canned-responses"])


@router.get("", response_model=list[CannedResponseResponse])
async def list_canned_responses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CannedResponse)
        .where(CannedResponse.business_id == current_user.business_id)
        .order_by(CannedResponse.title)
    )
    return result.scalars().all()


@router.get("/search", response_model=list[CannedResponseResponse])
async def search_canned_responses(
    q: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CannedResponse).where(
            CannedResponse.business_id == current_user.business_id,
            CannedResponse.title.ilike(f"%{q}%") | CannedResponse.shortcut.ilike(f"%{q}%"),
        )
    )
    return result.scalars().all()


@router.post("", response_model=CannedResponseResponse, status_code=status.HTTP_201_CREATED)
async def create_canned_response(
    data: CannedResponseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cr = CannedResponse(
        id=uuid4(),
        business_id=current_user.business_id,
        title=data.title,
        content=data.content,
        shortcut=data.shortcut,
        category=data.category,
        created_by=current_user.id,
    )
    db.add(cr)
    await db.commit()
    await db.refresh(cr)
    return cr


@router.put("/{cr_id}", response_model=CannedResponseResponse)
async def update_canned_response(
    cr_id: UUID,
    data: CannedResponseUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CannedResponse).where(
            CannedResponse.id == cr_id,
            CannedResponse.business_id == current_user.business_id,
        )
    )
    cr = result.scalar_one_or_none()
    if not cr:
        raise HTTPException(status_code=404, detail="Canned response not found")

    for field in ("title", "content", "shortcut", "category"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(cr, field, val)

    await db.commit()
    await db.refresh(cr)
    return cr


@router.delete("/{cr_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_canned_response(
    cr_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CannedResponse).where(
            CannedResponse.id == cr_id,
            CannedResponse.business_id == current_user.business_id,
        )
    )
    cr = result.scalar_one_or_none()
    if not cr:
        raise HTTPException(status_code=404, detail="Canned response not found")
    await db.delete(cr)
    await db.commit()
