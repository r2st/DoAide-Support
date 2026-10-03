from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.customers import Customer
from app.models.ticket_messages import SenderType, TicketMessage
from app.models.tickets import Ticket, TicketChannel
from app.models.users import User
from app.services.email_service import parse_inbound_email, send_email

router = APIRouter(prefix="/email", tags=["email"])


class InboundEmailData(BaseModel):
    from_field: str = ""
    subject: str = "No Subject"
    body: str = ""
    text: str = ""
    html: str = ""
    headers: dict = {}
    business_id: str = ""


class SendEmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    html: str | None = None


@router.post("/inbound")
async def inbound_email(
    data: InboundEmailData,
    db: AsyncSession = Depends(get_db),
):
    parsed = parse_inbound_email(data.model_dump())
    from_email = parsed["from_email"] or data.from_field

    if not from_email or not data.business_id:
        raise HTTPException(status_code=400, detail="Missing sender or business_id")

    from uuid import UUID
    business_id = UUID(data.business_id)

    result = await db.execute(
        select(Customer).where(Customer.email == from_email, Customer.business_id == business_id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        customer = Customer(id=uuid4(), business_id=business_id, email=from_email, name=from_email.split("@")[0])
        db.add(customer)
        await db.flush()

    ticket = Ticket(
        id=uuid4(),
        business_id=business_id,
        customer_id=customer.id,
        subject=parsed["subject"],
        channel=TicketChannel.EMAIL,
    )
    db.add(ticket)
    await db.flush()

    message = TicketMessage(
        id=uuid4(),
        ticket_id=ticket.id,
        sender_type=SenderType.CUSTOMER,
        sender_id=customer.id,
        body=parsed["body"],
    )
    db.add(message)
    await db.commit()

    return {"ticket_id": str(ticket.id), "status": "created"}


@router.post("/send")
async def send_email_reply(
    data: SendEmailRequest,
    current_user: User = Depends(get_current_user),
):
    success = await send_email(data.to, data.subject, data.body, data.html)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"status": "sent"}
