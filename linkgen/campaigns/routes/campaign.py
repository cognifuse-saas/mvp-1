from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from campaigns.schemas.campaign import Campaign, CampaignCreate, CampaignUpdate  # Corrected import
from campaigns import models
from database.db_session import get_db

campaign_router = APIRouter()

# Create a module-level dependency for DB session
db_dependency = Depends(get_db)

# Create a new campaign
@campaign_router.post("/", response_model=Campaign)
def create_campaign(
    campaign: CampaignCreate, db: Session = db_dependency
):
    db_campaign = models.Campaign(**campaign.dict())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

# Get all campaigns
@campaign_router.get("/", response_model=List[Campaign])
def get_campaigns(db: Session = db_dependency):
    campaigns = db.query(models.Campaign).all()
    return campaigns

# Get a specific campaign by ID
@campaign_router.get("/{campaign_id}", response_model=Campaign)
def get_campaign_by_id(campaign_id: int, db: Session = db_dependency):
    db_campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

# Update a campaign
@campaign_router.put("/{campaign_id}", response_model=Campaign)
def update_campaign(
    campaign_id: int, campaign: CampaignUpdate, db: Session = db_dependency
):
    db_campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if db_campaign:
        for var, value in vars(campaign).items():
            setattr(db_campaign, var, value) if value is not None else None
        db.add(db_campaign)
        db.commit()
        db.refresh(db_campaign)
    else:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

# Delete a campaign
@campaign_router.delete("/{campaign_id}", response_model=Campaign)
def delete_campaign(campaign_id: int, db: Session = db_dependency):
    db_campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if db_campaign:
        db.delete(db_campaign)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign
