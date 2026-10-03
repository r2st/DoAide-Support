from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.sla_policies import SLAPolicy
from app.models.tickets import Ticket, TicketStatus
from app.models.users import User
from app.schemas.sla import SLAPolicyCreate, SLAPolicyResponse, SLAPolicyUpdate
from app.services.sla_service import check_sla_breach

router = APIRouter(prefix="/sla", tags=["sla"])


@router.get("", response_model=list[SLAPolicyResponse])
async def list_sla_policies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SLAPolicy).where(SLAPolicy.business_id == current_user.business_id)
    )
    return result.scalars().all()


@router.post("", response_model=SLAPolicyResponse, status_code=status.HTTP_201_CREATED)
async def create_sla_policy(
    data: SLAPolicyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    policy = SLAPolicy(
        id=uuid4(),
        business_id=current_user.business_id,
        name=data.name,
        priority=data.priority,
        first_response_hours=data.first_response_hours,
        resolution_hours=data.resolution_hours,
    )
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return policy


@router.put("/{policy_id}", response_model=SLAPolicyResponse)
async def update_sla_policy(
    policy_id: UUID,
    data: SLAPolicyUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SLAPolicy).where(
            SLAPolicy.id == policy_id,
            SLAPolicy.business_id == current_user.business_id,
        )
    )
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="SLA policy not found")

    for field in ("name", "priority", "first_response_hours", "resolution_hours", "is_active"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(policy, field, val)

    await db.commit()
    await db.refresh(policy)
    return policy


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sla_policy(
    policy_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SLAPolicy).where(
            SLAPolicy.id == policy_id,
            SLAPolicy.business_id == current_user.business_id,
        )
    )
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="SLA policy not found")
    await db.delete(policy)
    await db.commit()


@router.get("/breaches")
async def get_sla_breaches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(
            Ticket.business_id == current_user.business_id,
            Ticket.status.in_([TicketStatus.OPEN, TicketStatus.PENDING]),
            Ticket.sla_policy_id.isnot(None),
        )
    )
    tickets = result.scalars().all()
    breaches = []

    for ticket in tickets:
        policy_result = await db.execute(select(SLAPolicy).where(SLAPolicy.id == ticket.sla_policy_id))
        policy = policy_result.scalar_one_or_none()
        if not policy:
            continue

        breach_info = check_sla_breach(
            ticket.created_at, ticket.first_response_at, ticket.resolved_at,
            policy.first_response_hours, policy.resolution_hours,
        )
        if breach_info["first_response_breached"] or breach_info["resolution_breached"]:
            breaches.append({
                "ticket_id": str(ticket.id),
                "subject": ticket.subject,
                "priority": ticket.priority.value,
                **breach_info,
            })

    return breaches
