from pydantic import BaseModel
from typing import Optional
from datetime import date

# Base class for Campaign schema
class CampaignBase(BaseModel):
    title: str
    description: str
    start_date: date
    end_date: date

# Create schema for creating a campaign
class CampaignCreate(CampaignBase):
    pass

# Update schema for updating a campaign
class CampaignUpdate(CampaignBase):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None

# Full schema for returning campaign details (with id and active status)
class Campaign(CampaignBase):
    id: int
    active: bool

    class Config:
        from_attributes = True
