from pydantic import BaseModel
from typing import Optional

class LinkedInProfile(BaseModel):
    id: str
    name: str
    headline: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    connection_status: str  # pending, connected, declined
    interaction_history: list