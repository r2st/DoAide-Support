import httpx

from app.config import settings

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


async def _gemini_generate(prompt: str, max_tokens: int = 500) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GEMINI_URL,
            params={"key": settings.GEMINI_API_KEY},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": max_tokens},
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def suggest_reply(ticket_subject: str, messages: list[dict], knowledge_context: str = "") -> str:
    prompt = (
        "You are a helpful customer support assistant. Based on the ticket context and "
        "knowledge base articles provided, draft a professional and helpful reply to the customer. "
        "Be concise, empathetic, and solution-oriented.\n\n"
    )
    prompt += f"Subject: {ticket_subject}\n\n"
    for msg in messages:
        role = "Customer" if msg["sender_type"] == "customer" else "Agent"
        prompt += f"{role}: {msg['body']}\n\n"
    if knowledge_context:
        prompt += f"\nRelevant knowledge base articles:\n{knowledge_context}\n"
    prompt += "\nDraft a reply to the customer:"

    return await _gemini_generate(prompt, max_tokens=500)


async def categorize_ticket(subject: str, body: str) -> dict:
    prompt = (
        f"Categorize this support ticket.\nSubject: {subject}\nBody: {body}\n\n"
        "Return a JSON with: priority (low/medium/high/urgent), tags (list of strings), "
        "suggested_category (string). Only return valid JSON."
    )
    import json
    content = await _gemini_generate(prompt, max_tokens=200)
    return json.loads(content)


async def summarize_thread(subject: str, messages: list[dict]) -> str:
    conversation = f"Subject: {subject}\n\n"
    for msg in messages:
        role = msg.get("sender_type", "unknown")
        conversation += f"[{role}]: {msg['body']}\n\n"

    prompt = f"Summarize this support ticket thread in 2-3 sentences:\n\n{conversation}"
    return await _gemini_generate(prompt, max_tokens=200)
