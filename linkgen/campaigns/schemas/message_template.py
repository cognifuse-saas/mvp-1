from pydantic import BaseModel

class MessageTemplateBase(BaseModel):
    name: str
    subject: str
    body: str

class MessageTemplateCreate(MessageTemplateBase):
    pass

class MessageTemplateUpdate(MessageTemplateBase):
    pass

class MessageTemplate(MessageTemplateBase):
    id: int

    class Config:
        orm_mode = True
