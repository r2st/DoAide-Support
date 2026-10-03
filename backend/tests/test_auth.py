import pytest


@pytest.mark.asyncio
async def test_register_user(client):
    response = await client.post("/api/auth/register", json={
        "email": "new@test.com",
        "password": "password123",
        "full_name": "New User",
        "business_name": "New Corp",
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_user(client, test_user):
    response = await client.post("/api/auth/login", json={
        "email": test_user.email,
        "password": "password123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post("/api/auth/login", json={
        "email": "nobody@test.com",
        "password": "wrong",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client, auth_headers, test_user):
    response = await client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["full_name"] == "Test Agent"


@pytest.mark.asyncio
async def test_register_duplicate_email(client, test_user):
    response = await client.post("/api/auth/register", json={
        "email": test_user.email,
        "password": "password123",
        "full_name": "Duplicate",
        "business_name": "Dup Corp",
    })
    assert response.status_code == 400
