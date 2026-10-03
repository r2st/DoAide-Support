import httpx

from app.config import settings


async def suggest_reply(ticket_subject: str, messages: list[dict], knowledge_context: str = "") -> str:
    system_prompt = (
        "You are a helpful customer support assistant. Based on the ticket context and "
        "knowledge base articles provided, draft a professional and helpful reply to the customer. "
        "Be concise, empathetic, and solution-oriented."
    )

    conversation = f"Subject: {ticket_subject}\n\n"
    for msg in messages:
        role = "Customer" if msg["sender_type"] == "customer" else "Agent"
        conversation += f"{role}: {msg['body']}\n\n"

    if knowledge_context:
        conversation += f"\nRelevant knowledge base articles:\n{knowledge_context}\n"

    conversation += "\nDraft a reply to the customer:"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": conversation},
                ],
                "max_tokens": 500,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def categorize_ticket(subject: str, body: str) -> dict:
    prompt = (
        f"Categorize this support ticket.\nSubject: {subject}\nBody: {body}\n\n"
        "Return a JSON with: priority (low/medium/high/urgent), tags (list of strings), "
        "suggested_category (string). Only return valid JSON."
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        import json
        content = response.json()["choices"][0]["message"]["content"]
        return json.loads(content)


async def summarize_thread(subject: str, messages: list[dict]) -> str:
    conversation = f"Subject: {subject}\n\n"
    for msg in messages:
        role = msg.get("sender_type", "unknown")
        conversation += f"[{role}]: {msg['body']}\n\n"

    prompt = f"Summarize this support ticket thread in 2-3 sentences:\n\n{conversation}"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
            },
            timeout=30.0,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
