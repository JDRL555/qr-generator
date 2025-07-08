from view.constants import API_HOST, API_PORT
from api.db import db
from api.models import GeneratePayload
from fastapi import APIRouter, HTTPException
from io import BytesIO
from datetime import datetime

import uuid
import base64
import qrcode

router = APIRouter()

@router.post("/generate")
async def generate_qr(payload: GeneratePayload):
    data = payload.data.strip()
    if not data:
        raise HTTPException(400, { "error": "El campo 'data' no puede estar vacío", "data": None })

    existing = await db.find_one({"data": data})
    if existing:
        code_id = existing["code_id"]
        await db.update_one({"data": data}, {"$inc": {"generated_count": 1}})
    else:
        code_id = str(uuid.uuid4())
        doc = {
            "code_id": code_id,
            "data": data,
            "generated_count": 1,
            "scan_count": 0,
            "created_at": datetime.utcnow().isoformat(),
        }
        await db.insert_one(doc)

    qr = qrcode.QRCode(box_size=10, border=4)
    qr.add_data(f"http://{payload=}")
    qr.add_data(f"{API_HOST}:{API_PORT}/scan/{code_id}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = BytesIO()
    img.save(buf, format="PNG")
    img_b64 = base64.b64encode(buf.getvalue()).decode()

    return {
      "error": None,
      "data": {
        "code_id": code_id, 
        "image_b64": img_b64
      }
    }
