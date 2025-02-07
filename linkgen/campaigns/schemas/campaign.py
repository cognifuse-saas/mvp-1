from pydantic import BaseModel
from datetime import date
from typing import Optional

class CampaignBase(BaseModel):
    title: str
    description: str
    start_date: date
    end_date: date

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(CampaignBase):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None

class Campaign(CampaignBase):
    id: int
    active: bool

    class Config:
        from_attributes = True
