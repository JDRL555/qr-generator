// src/components/QRGenerator.tsx
import { useState } from "react";

export default function QRGenerator({
  onCreated,
  disabled,
}: {
  onCreated: (target: string) => void;
  disabled?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    setError("");
    try {
      new URL(url);
    } catch {
      setError("Ingresa una URL válida");
      return;
    }
    onCreated(url);
    setUrl("");
  };

  return (
    <div className="generator">
      <input
        disabled={disabled}
        type="text"
        placeholder="https://ejemplo.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button disabled={disabled} onClick={handle}>
        Generar QR
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
