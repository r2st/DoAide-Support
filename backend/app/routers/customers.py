from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.customers import Customer
from app.models.tickets import Ticket
from app.models.users import User
from app.schemas.customers import CustomerCreate, CustomerResponse, CustomerUpdate
from app.schemas.tickets import TicketResponse

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("", response_model=list[CustomerResponse])
async def list_customers(
    search: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Customer).where(Customer.business_id == current_user.business_id)
    if search:
        query = query.where(
            Customer.name.ilike(f"%{search}%") | Customer.email.ilike(f"%{search}%")
        )
    query = query.order_by(Customer.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    data: CustomerCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    customer = Customer(
        id=uuid4(),
        business_id=current_user.business_id,
        email=data.email,
        name=data.name,
        phone=data.phone,
        avatar_url=data.avatar_url,
        metadata_=data.metadata,
    )
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: UUID,
    data: CustomerUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for field in ("email", "name", "phone", "avatar_url"):
        val = getattr(data, field, None)
        if val is not None:
            setattr(customer, field, val)
    if data.metadata is not None:
        customer.metadata_ = data.metadata

    await db.commit()
    await db.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    await db.delete(customer)
    await db.commit()


@router.get("/{customer_id}/tickets", response_model=list[TicketResponse])
async def get_customer_tickets(
    customer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Ticket).where(
            Ticket.customer_id == customer_id,
            Ticket.business_id == current_user.business_id,
        ).order_by(Ticket.created_at.desc())
    )
    return result.scalars().all()
