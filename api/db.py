from api.constants import MONGO_URI
from dotenv import load_dotenv

import os
import motor.motor_asyncio

load_dotenv()

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.qr_app.qrcodes