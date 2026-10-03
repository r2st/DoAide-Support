import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    PENDING = "pending"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TicketChannel(str, enum.Enum):
    WEB = "web"
    EMAIL = "email"
    CHAT = "chat"
    API = "api"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    subject = Column(String(500), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN, nullable=False)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False)
    tags = Column(JSON, default=list)
    channel = Column(Enum(TicketChannel), default=TicketChannel.WEB, nullable=False)
    sla_policy_id = Column(UUID(as_uuid=True), ForeignKey("sla_policies.id"), nullable=True)
    first_response_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    satisfaction_rating = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    business = relationship("Business", back_populates="tickets")
    customer = relationship("Customer", back_populates="tickets")
    assigned_agent = relationship("User", back_populates="assigned_tickets", foreign_keys=[assigned_to])
    messages = relationship("TicketMessage", back_populates="ticket", order_by="TicketMessage.created_at")
    sla_policy = relationship("SLAPolicy")
    chat_sessions = relationship("ChatSession", back_populates="ticket")
