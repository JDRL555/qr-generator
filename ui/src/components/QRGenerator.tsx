// src/components/QRGenerator.tsx
import { useState } from "react";

export default function QRGenerator({
  onCreated,
  disabled,
}: {
  onCreated: (name: string, target: string) => void;
  disabled?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    setError("");
    try {
      new URL(url);
    } catch {
      setError("Ingresa una URL válida");
      return;
    }
    onCreated(name, url);
    setUrl("");
  };

  return (
    <div className="generator">
      <input
        disabled={disabled}
        required
        type="text"
        placeholder="Titulo del QR"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        disabled={disabled}
        required
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
