from pydantic import BaseModel

class MessageTemplateBase(BaseModel):
    title: str
    content: str

    class Config:
        orm_mode = True

class MessageTemplateCreate(MessageTemplateBase):
    pass

class MessageTemplate(MessageTemplateBase):
    id: int

    class Config:
        orm_mode = True
