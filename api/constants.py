import os

# CORS allowed origins
MONGO_URI = os.getenv("MONGODB_URI")
ALLOWED_ORIGINS = ["*"]