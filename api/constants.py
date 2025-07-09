import os

# CORS allowed origins
MONGO_URI = os.getenv("MONGODB_URI")
API_HOST = os.getenv("API_HOST")
API_PORT = os.getenv("API_PORT")
ALLOWED_ORIGINS = ["*"]