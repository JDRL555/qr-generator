// src/components/QRItem.tsx
import type { QRDocument } from "../api/types";
import QRCode from "react-qr-code";

export default function QRItem({
  qr,
  onView,
  onDelete,
  disabled,
}: {
  qr: QRDocument;
  onView: (qr: QRDocument) => void;
  onDelete: (qr: QRDocument) => void;
  disabled?: boolean;
}) {
  return (
    <div className="qr-item">
      <QRCode
        value={qr.scan_url}
        size={80}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
      />
      <div className="info">
        <p>Nombre: {qr.name}</p>
        <p>Escaneado: {qr.scan_count}x</p>
      </div>
      <div className="actions">
        <button disabled={disabled} onClick={() => onView(qr)}>
          Ver
        </button>
        <button disabled={disabled} onClick={() => onDelete(qr)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
