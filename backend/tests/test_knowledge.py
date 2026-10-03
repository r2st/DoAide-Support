import pytest


@pytest.mark.asyncio
async def test_create_category(client, auth_headers):
    response = await client.post("/api/knowledge/categories", json={
        "name": "General",
        "slug": "general",
        "description": "General articles",
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "General"


@pytest.mark.asyncio
async def test_create_article(client, auth_headers):
    response = await client.post("/api/knowledge/articles", json={
        "title": "Getting Started",
        "slug": "getting-started",
        "content": "# Welcome\nThis is a guide.",
        "status": "published",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Getting Started"
    assert data["status"] == "published"


@pytest.mark.asyncio
async def test_list_articles(client, auth_headers):
    await client.post("/api/knowledge/articles", json={
        "title": "Article 1",
        "slug": "article-1",
        "content": "Content 1",
    }, headers=auth_headers)

    response = await client.get("/api/knowledge/articles", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_get_article_by_slug(client, auth_headers):
    await client.post("/api/knowledge/articles", json={
        "title": "Slug Article",
        "slug": "slug-article",
        "content": "Find me by slug",
    }, headers=auth_headers)

    response = await client.get("/api/knowledge/articles/slug-article", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Slug Article"


@pytest.mark.asyncio
async def test_update_article(client, auth_headers):
    create_res = await client.post("/api/knowledge/articles", json={
        "title": "Update Me",
        "slug": "update-me",
        "content": "Original",
    }, headers=auth_headers)
    article_id = create_res.json()["id"]

    response = await client.put(f"/api/knowledge/articles/{article_id}", json={
        "title": "Updated Title",
        "content": "Updated content",
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


@pytest.mark.asyncio
async def test_mark_article_helpful(client, auth_headers):
    create_res = await client.post("/api/knowledge/articles", json={
        "title": "Helpful Article",
        "slug": "helpful-article",
        "content": "Very helpful",
    }, headers=auth_headers)
    article_id = create_res.json()["id"]

    response = await client.post(f"/api/knowledge/articles/{article_id}/helpful")
    assert response.status_code == 200
    assert response.json()["helpful_count"] == 1
