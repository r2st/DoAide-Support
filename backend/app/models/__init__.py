from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.users import User
from app.models.businesses import Business
from app.models.tickets import Ticket
from app.models.ticket_messages import TicketMessage
from app.models.knowledge_articles import KnowledgeArticle
from app.models.knowledge_categories import KnowledgeCategory
from app.models.canned_responses import CannedResponse
from app.models.sla_policies import SLAPolicy
from app.models.customers import Customer
from app.models.chat_sessions import ChatSession
from app.models.usage_tracking import UsageTracking

__all__ = [
    "Base",
    "User",
    "Business",
    "Ticket",
    "TicketMessage",
    "KnowledgeArticle",
    "KnowledgeCategory",
    "CannedResponse",
    "SLAPolicy",
    "Customer",
    "ChatSession",
    "UsageTracking",
]
