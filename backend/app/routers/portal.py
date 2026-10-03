from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.customers import Customer
from app.models.knowledge_articles import ArticleStatus, KnowledgeArticle
from app.models.ticket_messages import SenderType, TicketMessage
from app.models.tickets import Ticket
from app.schemas.tickets import MessageCreate, MessageResponse, TicketResponse

router = APIRouter(prefix="/portal", tags=["portal"])


class PortalTicketCreate(BaseModel):
    email: EmailStr
    name: str
    business_id: UUID
    subject: str
    body: str


@router.post("/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def portal_create_ticket(data: PortalTicketCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Customer).where(Customer.email == data.email, Customer.business_id == data.business_id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        customer = Customer(id=uuid4(), business_id=data.business_id, email=data.email, name=data.name)
        db.add(customer)
        await db.flush()

    ticket = Ticket(
        id=uuid4(),
        business_id=data.business_id,
        customer_id=customer.id,
        subject=data.subject,
    )
    db.add(ticket)
    await db.flush()

    message = TicketMessage(
        id=uuid4(),
        ticket_id=ticket.id,
        sender_type=SenderType.CUSTOMER,
        sender_id=customer.id,
        body=data.body,
    )
    db.add(message)
    await db.commit()

    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket.id).options(selectinload(Ticket.messages))
    )
    return result.scalar_one()


@router.get("/tickets", response_model=list[TicketResponse])
async def portal_list_tickets(
    email: str = Query(...),
    business_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Customer).where(Customer.email == email, Customer.business_id == business_id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        return []

    result = await db.execute(
        select(Ticket)
        .where(Ticket.customer_id == customer.id)
        .options(selectinload(Ticket.messages))
        .order_by(Ticket.created_at.desc())
    )
    return result.scalars().all()


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def portal_get_ticket(ticket_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id).options(selectinload(Ticket.messages))
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/tickets/{ticket_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def portal_add_message(
    ticket_id: UUID,
    data: MessageCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    message = TicketMessage(
        id=uuid4(),
        ticket_id=ticket_id,
        sender_type=SenderType.CUSTOMER,
        sender_id=ticket.customer_id,
        body=data.body,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


@router.get("/knowledge", response_model=list[dict])
async def portal_knowledge(
    business_id: UUID = Query(...),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(KnowledgeArticle).where(
        KnowledgeArticle.business_id == business_id,
        KnowledgeArticle.status == ArticleStatus.PUBLISHED,
    )
    if search:
        query = query.where(
            KnowledgeArticle.title.ilike(f"%{search}%") | KnowledgeArticle.content.ilike(f"%{search}%")
        )
    query = query.order_by(KnowledgeArticle.helpful_count.desc())
    result = await db.execute(query)
    articles = result.scalars().all()

    return [
        {
            "id": str(a.id),
            "title": a.title,
            "slug": a.slug,
            "content": a.content,
            "helpful_count": a.helpful_count,
            "category_id": str(a.category_id) if a.category_id else None,
        }
        for a in articles
    ]
