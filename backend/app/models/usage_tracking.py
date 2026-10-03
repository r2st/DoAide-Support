import uuid
from datetime import datetime, date

from sqlalchemy import BigInteger, Column, Date, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models import Base


class UsageTracking(Base):
    __tablename__ = "usage_tracking"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id"), nullable=False)
    month = Column(Date, nullable=False)
    tickets_created = Column(Integer, default=0)
    ai_responses = Column(Integer, default=0)
    messages_sent = Column(Integer, default=0)
    storage_bytes = Column(BigInteger, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    business = relationship("Business", back_populates="usage_tracking")
