from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
import datetime

DATABASE_URL = "sqlite+aiosqlite:///./memory.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

class IdeaRecord(Base):
    __tablename__ = "ideas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    summary = Column(Text)
    insights = Column(JSON)
    actions = Column(JSON)
    risks = Column(JSON)
    opportunities = Column(JSON)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
