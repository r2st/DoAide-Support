import pytest


@pytest.mark.asyncio
async def test_create_canned_response(client, auth_headers):
    response = await client.post("/api/canned-responses", json={
        "title": "Greeting",
        "content": "Hello! How can I help you today?",
        "shortcut": "/greet",
        "category": "General",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Greeting"
    assert data["shortcut"] == "/greet"


@pytest.mark.asyncio
async def test_list_canned_responses(client, auth_headers):
    await client.post("/api/canned-responses", json={
        "title": "Thanks",
        "content": "Thank you for contacting us!",
    }, headers=auth_headers)

    response = await client.get("/api/canned-responses", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_search_canned_responses(client, auth_headers):
    await client.post("/api/canned-responses", json={
        "title": "Billing Help",
        "content": "For billing inquiries...",
        "shortcut": "/billing",
    }, headers=auth_headers)

    response = await client.get("/api/canned-responses/search?q=billing", headers=auth_headers)
    assert response.status_code == 200
    results = response.json()
    assert any("billing" in r["title"].lower() or "billing" in (r.get("shortcut") or "").lower() for r in results)
