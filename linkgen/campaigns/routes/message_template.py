from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from campaigns import models
from campaigns.schemas.message_template import MessageTemplate, MessageTemplateCreate, MessageTemplateUpdate
from database.db_session import get_db

message_template_router = APIRouter()

# Create module-level dependency
db_dependency = Depends(get_db)

# Create a new message template
@message_template_router.post("/", response_model=MessageTemplate)
def create_message_template(
    message_template: MessageTemplateCreate, db: Session = db_dependency
):
    db_message_template = models.MessageTemplate(**message_template.dict())
    db.add(db_message_template)
    db.commit()
    db.refresh(db_message_template)
    return db_message_template

# Get all message templates
@message_template_router.get("/", response_model=List[MessageTemplate])
def get_message_templates(db: Session = db_dependency):
    message_templates = db.query(models.MessageTemplate).all()
    return message_templates

# Get a specific message template by ID
@message_template_router.get("/{message_template_id}", response_model=MessageTemplate)
def get_message_template_by_id(
    message_template_id: int, db: Session = db_dependency
):
    db_message_template = (
        db.query(models.MessageTemplate)
        .filter(models.MessageTemplate.id == message_template_id)
        .first()
    )
    if db_message_template is None:
        raise HTTPException(status_code=404, detail="Message Template not found")
    return db_message_template

# Update a message template
@message_template_router.put("/{message_template_id}", response_model=MessageTemplate)
def update_message_template(
    message_template_id: int,
    message_template: MessageTemplateUpdate,
    db: Session = db_dependency,
):
    db_message_template = (
        db.query(models.MessageTemplate)
        .filter(models.MessageTemplate.id == message_template_id)
        .first()
    )
    if db_message_template:
        for key, value in message_template.dict(exclude_unset=True).items():
            setattr(db_message_template, key, value)
        db.commit()
        db.refresh(db_message_template)
        return db_message_template
    else:
        raise HTTPException(status_code=404, detail="Message Template not found")

# Delete a message template
@message_template_router.delete("/{message_template_id}", response_model=MessageTemplate)
def delete_message_template(
    message_template_id: int, db: Session = db_dependency
):
    db_message_template = (
        db.query(models.MessageTemplate)
        .filter(models.MessageTemplate.id == message_template_id)
        .first()
    )
    if db_message_template:
        db.delete(db_message_template)
        db.commit()
        return db_message_template
    else:
        raise HTTPException(status_code=404, detail="Message Template not found")
