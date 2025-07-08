from pydantic import BaseModel

class GeneratePayload(BaseModel):
    data: str

class QRDocument(BaseModel):
    code_id: str
    data: str
    generated_count: int
    scan_count: int
    created_at: str