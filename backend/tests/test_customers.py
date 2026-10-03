import pytest


@pytest.mark.asyncio
async def test_create_customer(client, auth_headers):
    response = await client.post("/api/customers", json={
        "email": "newcust@test.com",
        "name": "New Customer",
        "phone": "+1234567890",
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["email"] == "newcust@test.com"


@pytest.mark.asyncio
async def test_list_customers(client, auth_headers, customer):
    response = await client.get("/api/customers", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_get_customer_tickets(client, auth_headers, customer):
    await client.post("/api/tickets", json={
        "customer_id": str(customer.id),
        "subject": "Customer ticket",
        "body": "Body",
    }, headers=auth_headers)

    response = await client.get(f"/api/customers/{customer.id}/tickets", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1
