from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

# Load .env values
load_dotenv()

# Safely encode special characters in username and password
username = quote_plus(os.getenv("MONGO_USERNAME", ""))
password = quote_plus(os.getenv("MONGO_PASSWORD", ""))

# Construct full URI
MONGO_URI = f"mongodb+srv://{username}:{password}@job-assistant.jtqikct.mongodb.net/?retryWrites=true&w=majority&appName=job-assistant"

# Create client and DB
client = AsyncIOMotorClient(MONGO_URI)
db = client["job_assistant_db"]
