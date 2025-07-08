from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.constants import ALLOWED_ORIGINS
from api.routes.generate import router as gen_router
from api.routes.scan import router as scan_router

app = FastAPI()
app.add_middleware(CORSMiddleware,
                   allow_origins=ALLOWED_ORIGINS,
                   allow_methods=["*"],
                   allow_headers=["*"])

app.include_router(gen_router)
app.include_router(scan_router)
