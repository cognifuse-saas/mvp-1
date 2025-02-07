from sqlalchemy import Column, Integer, String, Boolean, Date
from database.db_session import Base

class CampaignModel(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="scheduled")  # Example default status
    active = Column(Boolean, default=True, nullable=False)