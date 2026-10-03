from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.ticket_messages import SenderType, TicketMessage
from app.models.tickets import Ticket, TicketPriority, TicketStatus
from app.models.users import User
from app.schemas.tickets import (
    MessageCreate,
    MessageResponse,
    TicketCreate,
    TicketListResponse,
    TicketResponse,
    TicketUpdate,
)

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get("", response_model=TicketListResponse)
async def list_tickets(
    status_filter: str | None = Query(None, alias="status"),
    priority: str | None = None,
    assigned_to: UUID | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Ticket).where(Ticket.business_id == current_user.business_id)

    if status_filter:
        query = query.where(Ticket.status == TicketStatus(status_filter))
    if priority:
        query = query.where(Ticket.priority == TicketPriority(priority))
    if assigned_to:
        query = query.where(Ticket.assigned_to == assigned_to)
    if search:
        query = query.where(Ticket.subject.ilike(f"%{search}%"))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    query = query.options(selectinload(Ticket.messages))
    query = query.order_by(Ticket.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    tickets = result.scalars().all()

    return TicketListResponse(tickets=tickets, total=total, page=page, per_page=per_page)


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    data: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ticket = Ticket(
        id=uuid4(),
        business_id=current_user.business_id,
        customer_id=data.customer_id,
        subject=data.subject,
        priority=TicketPriority(data.priority),
        channel=data.channel,
        tags=data.tags,
    )
    db.add(ticket)
    await db.flush()

    message = TicketMessage(
        id=uuid4(),
        ticket_id=ticket.id,
        sender_type=SenderType.CUSTOMER,
        sender_id=data.customer_id,
        body=data.body,
    )
    db.add(message)
    await db.commit()

    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket.id).options(selectinload(Ticket.messages))
    )
    return result.scalar_one()


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket)
        .where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
        .options(selectinload(Ticket.messages))
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: UUID,
    data: TicketUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if data.status is not None:
        ticket.status = TicketStatus(data.status)
        if data.status == "resolved" and not ticket.resolved_at:
            ticket.resolved_at = datetime.utcnow()
    if data.priority is not None:
        ticket.priority = TicketPriority(data.priority)
    if data.assigned_to is not None:
        ticket.assigned_to = data.assigned_to
    if data.tags is not None:
        ticket.tags = data.tags
    if data.sla_policy_id is not None:
        ticket.sla_policy_id = data.sla_policy_id

    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(
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
    await db.delete(ticket)
    await db.commit()


@router.post("/{ticket_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def add_message(
    ticket_id: UUID,
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if not ticket.first_response_at and data.sender_type == "agent":
        ticket.first_response_at = datetime.utcnow()

    message = TicketMessage(
        id=uuid4(),
        ticket_id=ticket_id,
        sender_type=SenderType(data.sender_type),
        sender_id=current_user.id,
        body=data.body,
        is_internal=data.is_internal,
        attachments=data.attachments,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


@router.post("/{ticket_id}/assign", response_model=TicketResponse)
async def assign_ticket(
    ticket_id: UUID,
    agent_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.business_id == current_user.business_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.assigned_to = agent_id
    await db.commit()
    await db.refresh(ticket)
    return ticket
