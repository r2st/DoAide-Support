import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, JSON, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class PlanType(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class Business(Base):
    __tablename__ = "businesses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    domain = Column(String(255))
    logo_url = Column(String(512))
    plan = Column(Enum(PlanType), default=PlanType.FREE, nullable=False)
    settings = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    users = relationship("User", back_populates="business")
    tickets = relationship("Ticket", back_populates="business")
    customers = relationship("Customer", back_populates="business")
    knowledge_articles = relationship("KnowledgeArticle", back_populates="business")
    knowledge_categories = relationship("KnowledgeCategory", back_populates="business")
    canned_responses = relationship("CannedResponse", back_populates="business")
    sla_policies = relationship("SLAPolicy", back_populates="business")
    chat_sessions = relationship("ChatSession", back_populates="business")
    usage_tracking = relationship("UsageTracking", back_populates="business")
