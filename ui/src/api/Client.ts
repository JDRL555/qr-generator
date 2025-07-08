import type { QRDocument, GenerateRequest } from "./types";

const API = import.meta.env.VITE_API_URL;

export async function fetchAll(): Promise<QRDocument[]> {
  const res = await fetch(`${API}/api/`);
  if (!res.ok) throw new Error("Error al listar QRs");
  return res.json();
}

export async function generateQR(
  body: GenerateRequest
): Promise<QRDocument> {
  const res = await fetch(`${API}/api/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteQR(code_id: string): Promise<void> {
  const res = await fetch(`${API}/api/${code_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error eliminando QR");
}
