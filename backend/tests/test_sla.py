import pytest


@pytest.mark.asyncio
async def test_create_sla_policy(client, auth_headers):
    response = await client.post("/api/sla", json={
        "name": "Urgent SLA",
        "priority": "urgent",
        "first_response_hours": 0.5,
        "resolution_hours": 4,
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Urgent SLA"
    assert data["first_response_hours"] == 0.5


@pytest.mark.asyncio
async def test_list_sla_policies(client, auth_headers):
    await client.post("/api/sla", json={
        "name": "Standard SLA",
        "priority": "medium",
        "first_response_hours": 4,
        "resolution_hours": 24,
    }, headers=auth_headers)

    response = await client.get("/api/sla", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_update_sla_policy(client, auth_headers):
    create_res = await client.post("/api/sla", json={
        "name": "Update SLA",
        "priority": "high",
        "first_response_hours": 2,
        "resolution_hours": 12,
    }, headers=auth_headers)
    policy_id = create_res.json()["id"]

    response = await client.put(f"/api/sla/{policy_id}", json={
        "resolution_hours": 8,
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["resolution_hours"] == 8
