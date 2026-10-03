import asyncio
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.main import app
from app.database import get_db
from app.models import Base
from app.middleware.auth import create_access_token, hash_password
from app.models.businesses import Business
from app.models.users import User, UserRole
from app.models.customers import Customer

TEST_DB_URL = "sqlite+aiosqlite:///./test.db"
engine = create_async_engine(TEST_DB_URL, echo=False)
test_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db():
    async with test_session() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture
async def db():
    async with test_session() as session:
        yield session


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest_asyncio.fixture
async def business(db: AsyncSession):
    biz = Business(id=uuid4(), name="Test Corp", slug=f"test-corp-{uuid4().hex[:6]}")
    db.add(biz)
    await db.commit()
    await db.refresh(biz)
    return biz


@pytest_asyncio.fixture
async def test_user(db: AsyncSession, business):
    user = User(
        id=uuid4(),
        email=f"agent-{uuid4().hex[:6]}@test.com",
        hashed_password=hash_password("password123"),
        full_name="Test Agent",
        role=UserRole.ADMIN,
        business_id=business.id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@pytest_asyncio.fixture
async def auth_headers(test_user):
    token = create_access_token({"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def customer(db: AsyncSession, business):
    cust = Customer(
        id=uuid4(),
        business_id=business.id,
        email=f"customer-{uuid4().hex[:6]}@test.com",
        name="Test Customer",
    )
    db.add(cust)
    await db.commit()
    await db.refresh(cust)
    return cust
