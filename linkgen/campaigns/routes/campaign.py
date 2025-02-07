from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from campaigns.models.campaign import CampaignModel
from campaigns.schemas.campaign import (
    Campaign as CampaignSchema,
    CampaignCreate,
    CampaignUpdate,
)
from database.db_session import get_db

campaign_router = APIRouter()

# Create a new campaign
@campaign_router.post("/", response_model=CampaignSchema)
def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = CampaignModel(**campaign.model_dump())  # Fixed dict() usage
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

# Get all campaigns with pagination and proper serialization
@campaign_router.get("/", response_model=dict)
def get_campaigns(
    db: Session = Depends(get_db),
    page: int = Query(1, alias="page", ge=1),
    per_page: int = Query(10, alias="per_page", ge=1, le=100),
):
    total = db.query(CampaignModel).count()
    campaigns = (
        db.query(CampaignModel).offset((page - 1) * per_page).limit(per_page).all()
    )

    # Convert SQLAlchemy models to Pydantic schemas
    campaigns_data = [CampaignSchema.model_validate(c) for c in campaigns]

    return {
        "data": campaigns_data,
        "total": total,
        "page": page,
        "totalPages": (total // per_page) + (1 if total % per_page else 0),
    }


# Get a specific campaign by ID
@campaign_router.get("/{campaign_id}", response_model=CampaignSchema)
def get_campaign_by_id(campaign_id: int, db: Session = Depends(get_db)):
    db_campaign = (
        db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    )
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

# Update a campaign
@campaign_router.put("/{campaign_id}", response_model=CampaignSchema)
def update_campaign(
    campaign_id: int, campaign: CampaignUpdate, db: Session = Depends(get_db)
):
    db_campaign = (
        db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    )
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign_data = campaign.model_dump(exclude_unset=True)  # Fix: Exclude unset values
    for key, value in campaign_data.items():
        setattr(db_campaign, key, value)

    db.commit()
    db.refresh(db_campaign)
    return db_campaign

# Delete a campaign (Soft Delete)
@campaign_router.delete("/{campaign_id}", response_model=dict)
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)):
    db_campaign = (
        db.query(CampaignModel).filter(CampaignModel.id == campaign_id).first()
    )
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db.delete(db_campaign)
    db.commit()
    return {"success": True}
