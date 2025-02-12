from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from linkedin_client import LinkedInClient
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

app = FastAPI()
linkedin_client = LinkedInClient()

class SearchRequest(BaseModel):
    keywords: str
    limit: Optional[int] = 10

class ConnectionRequest(BaseModel):
    profile_id: str
    message: Optional[str] = ""

class MessageRequest(BaseModel):
    profile_id: str
    message: str

def generate_connection_message(profile_data):
    """Generate personalized connection message using OpenAI"""
    try:
        prompt = f"""
        Generate a friendly LinkedIn connection request message for a person with the following details:
        Name: {profile_data.get('firstName', '')} {profile_data.get('lastName', '')}
        Title: {profile_data.get('headline', '')}
        Company: {profile_data.get('company', '')}
        
        Keep it professional, personalized, and under 300 characters.
        """
        
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=100,
            temperature=0.7
        )
        
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error generating message: {str(e)}")
        return "I'd like to connect with you on LinkedIn."

@app.get("/")
def read_root():
    return {"status": "LinkedIn Automation API is running"}

@app.post("/search")
def search_people(request: SearchRequest):
    """Search for people on LinkedIn"""
    results = linkedin_client.search_people(request.keywords, request.limit)
    if not results:
        raise HTTPException(status_code=404, detail="No results found")
    return {"results": results}

@app.post("/connect")
def send_connection(request: ConnectionRequest):
    """Send connection request"""
    # Get profile data first
    profile_data = linkedin_client.get_profile(request.profile_id)
    if not profile_data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Generate message if not provided
    message = request.message or generate_connection_message(profile_data)
    
    # Send connection request
    success = linkedin_client.send_connection_request(request.profile_id, message)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send connection request")
    
    return {"status": "success", "message": "Connection request sent"}

@app.post("/message")
def send_message(request: MessageRequest):
    """Send message to a connection"""
    success = linkedin_client.send_message(request.profile_id, request.message)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send message")
    return {"status": "success", "message": "Message sent"} 