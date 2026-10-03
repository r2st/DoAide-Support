import json
from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, async_session
from app.middleware.auth import get_current_user
from app.models.chat_sessions import ChatSession, ChatStatus
from app.models.users import User
from app.schemas.chat import ChatSessionCreate, ChatSessionResponse

router = APIRouter(prefix="/chat", tags=["chat"])

active_connections: dict[str, list[WebSocket]] = {}


@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session = ChatSession(
        id=uuid4(),
        business_id=current_user.business_id,
        customer_id=data.customer_id,
        ticket_id=data.ticket_id,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.business_id == current_user.business_id,
            ChatSession.status.in_([ChatStatus.WAITING, ChatStatus.ACTIVE]),
        ).order_by(ChatSession.started_at.desc())
    )
    return result.scalars().all()


@router.put("/sessions/{session_id}/end", response_model=ChatSessionResponse)
async def end_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.business_id == current_user.business_id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = ChatStatus.ENDED
    session.ended_at = datetime.utcnow()
    await db.commit()
    await db.refresh(session)
    return session


@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await websocket.accept()

    if session_id not in active_connections:
        active_connections[session_id] = []
    active_connections[session_id].append(websocket)

    try:
        async with async_session() as db:
            result = await db.execute(
                select(ChatSession).where(ChatSession.id == UUID(session_id))
            )
            session = result.scalar_one_or_none()
            if session and session.status == ChatStatus.WAITING:
                session.status = ChatStatus.ACTIVE
                await db.commit()

        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            message["timestamp"] = datetime.utcnow().isoformat()

            for conn in active_connections.get(session_id, []):
                if conn != websocket:
                    await conn.send_text(json.dumps(message))
    except WebSocketDisconnect:
        active_connections.get(session_id, []).remove(websocket) if websocket in active_connections.get(session_id, []) else None
        if not active_connections.get(session_id):
            active_connections.pop(session_id, None)
