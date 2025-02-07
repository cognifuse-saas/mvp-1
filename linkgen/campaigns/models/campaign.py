from sqlalchemy import Column, Integer, String, Boolean
from database.db_session import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

# Explicitly define what should be accessible when importing from this module
__all__ = ["Campaign"]
