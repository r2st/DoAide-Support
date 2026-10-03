from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.tickets import Ticket, TicketStatus
from app.models.users import User

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/ticket-volume")
async def ticket_volume(
    start_date: date | None = None,
    end_date: date | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()

    query = select(
        func.date(Ticket.created_at).label("day"),
        func.count(Ticket.id).label("count"),
    ).where(
        Ticket.business_id == current_user.business_id,
        func.date(Ticket.created_at) >= start_date,
        func.date(Ticket.created_at) <= end_date,
    ).group_by(func.date(Ticket.created_at)).order_by(func.date(Ticket.created_at))

    result = await db.execute(query)
    rows = result.all()
    data = [{"date": str(r.day), "count": r.count} for r in rows]
    total = sum(r.count for r in rows)

    return {"data": data, "total": total}


@router.get("/response-time")
async def response_time(
    start_date: date | None = None,
    end_date: date | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()

    query = select(Ticket).where(
        Ticket.business_id == current_user.business_id,
        func.date(Ticket.created_at) >= start_date,
        func.date(Ticket.created_at) <= end_date,
    )

    result = await db.execute(query)
    tickets = result.scalars().all()

    first_response_hours = []
    resolution_hours = []

    for t in tickets:
        if t.first_response_at:
            delta = (t.first_response_at - t.created_at).total_seconds() / 3600
            first_response_hours.append(delta)
        if t.resolved_at:
            delta = (t.resolved_at - t.created_at).total_seconds() / 3600
            resolution_hours.append(delta)

    def avg(lst):
        return sum(lst) / len(lst) if lst else 0

    def median(lst):
        if not lst:
            return 0
        s = sorted(lst)
        n = len(s)
        return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2

    return {
        "avg_first_response_hours": round(avg(first_response_hours), 2),
        "avg_resolution_hours": round(avg(resolution_hours), 2),
        "median_first_response_hours": round(median(first_response_hours), 2),
        "median_resolution_hours": round(median(resolution_hours), 2),
    }


@router.get("/satisfaction")
async def satisfaction(
    start_date: date | None = None,
    end_date: date | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()

    result = await db.execute(
        select(Ticket).where(
            Ticket.business_id == current_user.business_id,
            Ticket.satisfaction_rating.isnot(None),
            func.date(Ticket.created_at) >= start_date,
            func.date(Ticket.created_at) <= end_date,
        )
    )
    tickets = result.scalars().all()
    ratings = [t.satisfaction_rating for t in tickets]
    dist = {str(i): ratings.count(i) for i in range(1, 6)}

    return {
        "average_rating": round(sum(ratings) / len(ratings), 2) if ratings else 0,
        "total_ratings": len(ratings),
        "distribution": dist,
    }


@router.get("/agent-performance")
async def agent_performance(
    start_date: date | None = None,
    end_date: date | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not start_date:
        start_date = date.today() - timedelta(days=30)
    if not end_date:
        end_date = date.today()

    agents_result = await db.execute(
        select(User).where(User.business_id == current_user.business_id)
    )
    agents = agents_result.scalars().all()

    performance = []
    for agent in agents:
        tickets_result = await db.execute(
            select(Ticket).where(
                Ticket.assigned_to == agent.id,
                func.date(Ticket.created_at) >= start_date,
                func.date(Ticket.created_at) <= end_date,
            )
        )
        agent_tickets = tickets_result.scalars().all()

        resolved = [t for t in agent_tickets if t.status == TicketStatus.RESOLVED or t.status == TicketStatus.CLOSED]
        response_hours = []
        sat_ratings = []

        for t in agent_tickets:
            if t.first_response_at:
                response_hours.append((t.first_response_at - t.created_at).total_seconds() / 3600)
            if t.satisfaction_rating:
                sat_ratings.append(t.satisfaction_rating)

        performance.append({
            "agent_id": str(agent.id),
            "agent_name": agent.full_name,
            "tickets_resolved": len(resolved),
            "avg_response_hours": round(sum(response_hours) / len(response_hours), 2) if response_hours else 0,
            "satisfaction_avg": round(sum(sat_ratings) / len(sat_ratings), 2) if sat_ratings else 0,
        })

    return {"agents": performance}
