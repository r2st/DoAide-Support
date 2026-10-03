import pytest


@pytest.mark.asyncio
async def test_ticket_volume_report(client, auth_headers):
    response = await client.get("/api/reports/ticket-volume", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_response_time_report(client, auth_headers):
    response = await client.get("/api/reports/response-time", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "avg_first_response_hours" in data
    assert "avg_resolution_hours" in data
