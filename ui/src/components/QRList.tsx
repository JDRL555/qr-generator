// src/components/QRList.tsx
import type { QRDocument } from "../api/types";
import QRItem from "./QRItem";

export default function QRList({
  list,
  onView,
  onDelete,
  disabled,
}: {
  list: QRDocument[];
  onView: (qr: QRDocument) => void;
  onDelete: (qr: QRDocument) => void;
  disabled?: boolean;
}) {
  return (
    <div className="qr-list">
      {list.map((qr) => (
        <QRItem
          key={qr.code_id}
          qr={qr}
          onView={onView}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
