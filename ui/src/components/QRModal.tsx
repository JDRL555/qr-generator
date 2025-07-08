// src/components/QRModal.tsx
import { useRef } from "react";
import QRCode from "react-qr-code";
import type { QRDocument } from "../api/types";

export default function QRModal({
  qr,
  onClose,
}: {
  qr: QRDocument;
  onClose: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const svgToCanvas = (): Promise<HTMLCanvasElement> =>
    new Promise((res, rej) => {
      if (!wrapperRef.current) rej("No hay SVG");
      const svg = wrapperRef.current!.querySelector("svg");
      if (!svg) rej("SVG no hallado");
      const xml = new XMLSerializer().serializeToString(svg!);
      const blob = new Blob([xml], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        res(canvas);
      };
      img.onerror = (e) => rej(e);
      img.src = url;
    });

  const copy = async () => {
    try {
      const canvas = await svgToCanvas();
      canvas.toBlob(async (b) => {
        if (b) await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]);
      }, "image/png");
    } catch (e) {
      console.error(e);
    }
  };

  const download = async () => {
    try {
      const canvas = await svgToCanvas();
      canvas.toBlob((b) => {
        if (!b) return;
        const url = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qr-${qr.code_id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>
        <div className="qr-wrapper" ref={wrapperRef}>
          <QRCode
            value={qr.scan_url}
            size={300}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>
        <div className="buttons">
          <button onClick={copy}>Copiar</button>
          <button onClick={download}>Descargar</button>
        </div>
      </div>
    </div>
  );
}
