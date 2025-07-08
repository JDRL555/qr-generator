import threading
import uvicorn
from api.main      import app as api_app
from view.gui      import run_gui

def run_api():
    uvicorn.run(
        api_app,
        host="0.0.0.0",
        port=int(__import__("os").environ.get("API_PORT", 8000)),
    )

if __name__ == "__main__":
    threading.Thread(target=run_api, daemon=True).start()
    run_gui()
