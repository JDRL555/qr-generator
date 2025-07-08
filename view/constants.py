import os

# Colores y configuración
THEME = {
    "bg": "#000000",
    "text": "#ffffff",
    "highlight": "#e91e63",
    "btn_primary": ("#ffffff", "#e91e63"),
    "btn_secondary": ("#ffffff", "#4a4a4a"),
}

# API credentials
API_HOST = os.environ.get("API_HOST")
API_PORT = os.environ.get("API_PORT")