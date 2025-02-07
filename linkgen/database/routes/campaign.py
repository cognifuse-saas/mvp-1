from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.message_template import MessageTemplate as DBMessageTemplate
from schemas.message_template import MessageTemplateCreate, MessageTemplate
from database.db_session import SessionLocal, get_db

router = APIRouter()

# Create module-level dependency
db_dependency = Depends(get_db)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/message_templates/", response_model=MessageTemplate)
def create_message_template(
    message_template: MessageTemplateCreate, db: Session = db_dependency
):
    db_message_template = DBMessageTemplate(
        title=message_template.title, content=message_template.content
    )
    db.add(db_message_template)
    db.commit()
    db.refresh(db_message_template)
    return db_message_template

@router.get("/message_templates/{message_template_id}", response_model=MessageTemplate)
def read_message_template(
    message_template_id: int, db: Session = db_dependency
):
    db_message_template = db.query(DBMessageTemplate).filter(DBMessageTemplate.id == message_template_id).first()
    if db_message_template is None:
        raise HTTPException(status_code=404, detail="MessageTemplate not found")
    return db_message_template

@router.get("/message_templates/", response_model=list[MessageTemplate])
def read_message_templates(skip: int = 0, limit: int = 10, db: Session = db_dependency):
    return db.query(DBMessageTemplate).offset(skip).limit(limit).all()
