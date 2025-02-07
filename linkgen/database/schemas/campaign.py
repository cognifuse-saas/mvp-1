from pydantic import BaseModel

class CampaignBase(BaseModel):
    name: str
    active: bool = True

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int

    class Config:
        orm_mode = True
