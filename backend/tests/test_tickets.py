import pytest


@pytest.mark.asyncio
async def test_create_ticket(client, auth_headers, customer):
    response = await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Test ticket",
        "body": "This is a test ticket body",
        "priority": "high",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["subject"] == "Test ticket"
    assert data["priority"] == "high"
    assert data["status"] == "open"


@pytest.mark.asyncio
async def test_list_tickets(client, auth_headers, customer):
    await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Ticket 1",
        "body": "Body 1",
    }, headers=auth_headers)

    response = await client.get("/api/tickets", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["tickets"]) >= 1


@pytest.mark.asyncio
async def test_get_ticket(client, auth_headers, customer):
    create_res = await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Get this ticket",
        "body": "Details",
    }, headers=auth_headers)
    ticket_id = create_res.json()["id"]

    response = await client.get(f"/api/tickets/{ticket_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["subject"] == "Get this ticket"


@pytest.mark.asyncio
async def test_update_ticket_status(client, auth_headers, customer):
    create_res = await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Update me",
        "body": "Body",
    }, headers=auth_headers)
    ticket_id = create_res.json()["id"]

    response = await client.put(f"/api/tickets/{ticket_id}", json={
        "status": "resolved",
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "resolved"


@pytest.mark.asyncio
async def test_add_message_to_ticket(client, auth_headers, customer):
    create_res = await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Message test",
        "body": "Initial",
    }, headers=auth_headers)
    ticket_id = create_res.json()["id"]

    response = await client.post(f"/api/tickets/{ticket_id}/messages", json={
        "body": "Agent reply here",
        "sender_type": "agent",
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["body"] == "Agent reply here"


@pytest.mark.asyncio
async def test_assign_ticket(client, auth_headers, customer, test_user):
    create_res = await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Assign me",
        "body": "Body",
    }, headers=auth_headers)
    ticket_id = create_res.json()["id"]

    response = await client.post(
        f"/api/tickets/{ticket_id}/assign?agent_id={test_user.id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["assigned_to"] == str(test_user.id)
