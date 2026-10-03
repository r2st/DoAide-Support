from datetime import datetime, timedelta


def check_sla_breach(ticket_created_at: datetime, first_response_at: datetime | None,
                     resolved_at: datetime | None, first_response_hours: float,
                     resolution_hours: float) -> dict:
    now = datetime.utcnow()

    first_response_deadline = ticket_created_at + timedelta(hours=first_response_hours)
    resolution_deadline = ticket_created_at + timedelta(hours=resolution_hours)

    first_response_breached = False
    resolution_breached = False

    if first_response_at:
        first_response_breached = first_response_at > first_response_deadline
    else:
        first_response_breached = now > first_response_deadline

    if resolved_at:
        resolution_breached = resolved_at > resolution_deadline
    else:
        resolution_breached = now > resolution_deadline

    return {
        "first_response_breached": first_response_breached,
        "resolution_breached": resolution_breached,
        "first_response_deadline": first_response_deadline.isoformat(),
        "resolution_deadline": resolution_deadline.isoformat(),
    }


def get_sla_status(ticket_created_at: datetime, first_response_at: datetime | None,
                   resolved_at: datetime | None, first_response_hours: float,
                   resolution_hours: float) -> dict:
    now = datetime.utcnow()
    breach = check_sla_breach(ticket_created_at, first_response_at, resolved_at,
                              first_response_hours, resolution_hours)

    first_response_deadline = ticket_created_at + timedelta(hours=first_response_hours)
    resolution_deadline = ticket_created_at + timedelta(hours=resolution_hours)

    fr_remaining = (first_response_deadline - now).total_seconds() / 3600 if not first_response_at else 0
    res_remaining = (resolution_deadline - now).total_seconds() / 3600 if not resolved_at else 0

    return {
        **breach,
        "first_response_remaining_hours": max(0, fr_remaining),
        "resolution_remaining_hours": max(0, res_remaining),
    }
