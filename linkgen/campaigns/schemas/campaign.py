# campaigns/schemas/campaign.py

from pydantic import BaseModel
from typing import Optional

# Base class for Campaign schema
class CampaignBase(BaseModel):
    title: str
    description: str
    start_date: str
    end_date: str

# Create schema for creating a campaign
class CampaignCreate(CampaignBase):
    pass

# Update schema for updating a campaign
class CampaignUpdate(CampaignBase):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

# Full schema for returning campaign details (with id)
class Campaign(CampaignBase):
    id: int

    class Config:
        orm_mode = True
