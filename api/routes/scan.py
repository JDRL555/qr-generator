from api.db import db
from fastapi import APIRouter, Response, HTTPException

router = APIRouter()

@router.get("/scan/{code_id}")
async def scan_qr(code_id: str):
    doc = await db.find_one({"code_id": code_id})
    if not doc:
        raise HTTPException(400, { "error": "QR no encontrado", "data": None })

    await db.update_one({"code_id": code_id}, {"$inc": {"scan_count": 1}})
    return Response(content="¡Gracias por escanear!", media_type="text/plain")