from datetime import date, datetime

from pydantic import BaseModel


class ReportFilters(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    agent_id: str | None = None


class TicketVolumePoint(BaseModel):
    date: str
    count: int


class TicketVolumeReport(BaseModel):
    data: list[TicketVolumePoint]
    total: int


class ResponseTimeReport(BaseModel):
    avg_first_response_hours: float
    avg_resolution_hours: float
    median_first_response_hours: float
    median_resolution_hours: float


class SatisfactionReport(BaseModel):
    average_rating: float
    total_ratings: int
    distribution: dict[str, int]


class AgentPerformanceEntry(BaseModel):
    agent_id: str
    agent_name: str
    tickets_resolved: int
    avg_response_hours: float
    satisfaction_avg: float


class AgentPerformanceReport(BaseModel):
    agents: list[AgentPerformanceEntry]
