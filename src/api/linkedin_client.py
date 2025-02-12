from linkedin_api import Linkedin
import os
from dotenv import load_dotenv
import time
import random

# Load environment variables
load_dotenv()

class LinkedInClient:
    def __init__(self):
        """Initialize LinkedIn client with credentials from environment variables"""
        self.email = os.getenv('LINKEDIN_EMAIL')
        self.password = os.getenv('LINKEDIN_PASSWORD')
        self.max_daily_connections = int(os.getenv('MAX_DAILY_CONNECTIONS', 10))
        
        # Initialize connection counter
        self.daily_connection_count = 0
        
        # Connect to LinkedIn
        self.api = Linkedin(self.email, self.password)

    def search_people(self, keywords, limit=10):
        """
        Search for people on LinkedIn based on keywords
        Args:
            keywords (str): Search keywords (e.g., "Software Engineer AND Google")
            limit (int): Maximum number of results to return
        """
        try:
            results = self.api.search_people(keywords=keywords)
            return results[:limit] if results else []
        except Exception as e:
            print(f"Error searching people: {str(e)}")
            return []

    def send_connection_request(self, profile_id, message=""):
        """
        Send a connection request to a profile
        Args:
            profile_id (str): LinkedIn profile ID
            message (str): Optional connection message
        """
        # Check daily connection limit
        if self.daily_connection_count >= self.max_daily_connections:
            raise Exception("Daily connection limit reached")

        try:
            # Add random delay for safety
            delay = random.uniform(5, 10)  # 5-10 seconds delay
            time.sleep(delay)
            
            # Send connection request
            self.api.invite_to_connect(profile_id, message=message)
            self.daily_connection_count += 1
            return True
        except Exception as e:
            print(f"Error sending connection request: {str(e)}")
            return False

    def send_message(self, profile_id, message):
        """
        Send a message to a connection
        Args:
            profile_id (str): LinkedIn profile ID
            message (str): Message to send
        """
        try:
            # Add random delay for safety
            delay = random.uniform(5, 10)
            time.sleep(delay)
            
            # Send message
            self.api.send_message(profile_ids=[profile_id], message=message)
            return True
        except Exception as e:
            print(f"Error sending message: {str(e)}")
            return False

    def get_profile(self, profile_id):
        """
        Get profile information
        Args:
            profile_id (str): LinkedIn profile ID
        """
        try:
            return self.api.get_profile(profile_id)
        except Exception as e:
            print(f"Error getting profile: {str(e)}")
            return None 