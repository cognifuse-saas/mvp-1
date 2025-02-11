from fastapi import FastAPI
from campaigns.routes.campaign import campaign_router
from campaigns.routes.message_template import message_template_router
from profiles.routes.profile import profile_router


app = FastAPI()

app.include_router(campaign_router, prefix="/api/v1/campaigns", tags=["Campaigns"])
app.include_router(message_template_router, prefix="/api/v1/message_templates", tags=["Message Templates"])
app.include_router(profile_router, prefix="/api/v1/profiles", tags=["Profiles"])