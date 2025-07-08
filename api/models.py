from pydantic import BaseModel, HttpUrl
from datetime import datetime

class GenerateRequest(BaseModel):
    target: HttpUrl   # la URL final a la que queremos redirigir

class QRDocument(BaseModel):
    code_id: str
    target: HttpUrl       # URL original
    scan_path: str        # ruta interna, ej: "/r/...."
    scan_url: HttpUrl     # URL completa, ej: "http://host:port/r/..."
    generated_count: int
    scan_count: int
    created_at: datetime
