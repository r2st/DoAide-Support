from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.knowledge_articles import ArticleStatus, KnowledgeArticle
from app.models.tickets import Ticket
from app.models.users import User
from app.services.ai_service import categorize_ticket, suggest_reply, summarize_thread

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/suggest-reply")
async def ai_suggest_reply(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id).options(selectinload(Ticket.messages))
    )
    ticket = result.scalar_one()

    messages = [{"sender_type": m.sender_type.value, "body": m.body} for m in ticket.messages]

    articles_result = await db.execute(
        select(KnowledgeArticle).where(
            KnowledgeArticle.business_id == current_user.business_id,
            KnowledgeArticle.status == ArticleStatus.PUBLISHED,
        ).limit(5)
    )
    articles = articles_result.scalars().all()
    knowledge_context = "\n\n".join([f"### {a.title}\n{a.content[:500]}" for a in articles])

    reply = await suggest_reply(ticket.subject, messages, knowledge_context)
    return {"suggested_reply": reply}


@router.post("/categorize")
async def ai_categorize(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id).options(selectinload(Ticket.messages))
    )
    ticket = result.scalar_one()
    body = ticket.messages[0].body if ticket.messages else ""

    categorization = await categorize_ticket(ticket.subject, body)
    return categorization


@router.post("/summarize")
async def ai_summarize(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy.orm import selectinload

    result = await db.execute(
        select(Ticket)
        .where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
        .options(selectinload(Ticket.messages))
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    messages = [{"sender_type": m.sender_type.value, "body": m.body} for m in ticket.messages]
    summary = await summarize_thread(ticket.subject, messages)
    return {"summary": summary}
