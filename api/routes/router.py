from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import uuid
from datetime import datetime

from db import collection
from models import GenerateRequest, QRDocument
from constants import API_HOST, API_PORT

router = APIRouter()

# 1) Punto de escaneo: registra y redirige
@router.get("/{code_id}")
async def scan_and_redirect(code_id: str):
    doc = await collection.find_one({"code_id": code_id})
    if not doc:
        raise HTTPException(404, "QR no encontrado")
    await collection.update_one({"code_id": code_id}, {"$inc": {"scan_count": 1}})
    return RedirectResponse(url=doc["target"])

# 2) Listar todos los QR
@router.get("/", response_model=list[QRDocument])
async def list_qrs():
    qrs = []
    cursor = collection.find().sort("created_at", -1)
    async for doc in cursor:
        qrs.append({
            "name":          doc["name"],
            "code_id":       doc["code_id"],
            "target":        doc["target"],
            "scan_path":     f"/r/{doc['code_id']}",
            "scan_url":      f"https://{API_HOST}/api/{doc['code_id']}/",
            "generated_count": doc["generated_count"],
            "scan_count":    doc["scan_count"],
            "created_at":    doc["created_at"],
        })
    return qrs

# 3) Generar un QR nuevo o incrementar su contador
@router.post("/", response_model=QRDocument)
async def generate_qr(req: GenerateRequest):
    target = str(req.target)
    # ¿ya existe ese target?
    doc = await collection.find_one({"target": target})
    if doc:
        await collection.update_one({"target": target}, {"$inc": {"generated_count": 1}})
    else:
        doc = {
            "name":           str(req.name),
            "code_id":        str(uuid.uuid4()),
            "target":         target,
            "generated_count": 1,
            "scan_count":     0,
            "created_at":     datetime.utcnow(),
        }
        await collection.insert_one(doc)

    return {
        "name":           doc["name"],
        "code_id":        doc["code_id"],
        "target":         doc["target"],
        "scan_path":      f"/r/{doc['code_id']}",
        "scan_url":       f"https://{API_HOST}/api/{doc['code_id']}",
        "generated_count": doc["generated_count"],
        "scan_count":     doc["scan_count"],
        "created_at":     doc["created_at"],
    }

# 4) Eliminar un QR
@router.delete("/{code_id}")
async def delete_qr(code_id: str):
    res = await collection.delete_one({"code_id": code_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "QR no encontrado")
    return {"detail": "QR eliminado correctamente"}
