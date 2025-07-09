// src/App.tsx
import { useState, useEffect } from "react";
import type { QRDocument } from "./api/types";
import { fetchAll, generateQR, deleteQR } from "./api/Client";
import QRGenerator from "./components/QRGenerator";
import QRList from "./components/QRList";
import QRModal from "./components/QRModal";
import ConfirmModal from "./components/ConfirmModal";
import LoadingOverlay from "./components/LoadingOverlay";

import './App.css'

export default function App() {
  const [qrList, setQrList] = useState<QRDocument[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingOp, setLoadingOp] = useState(false);
  const [selected, setSelected] = useState<QRDocument | null>(null);
  const [toDelete, setToDelete] = useState<QRDocument | null>(null);

  // Función para (re)cargar la lista
  const loadList = async () => {
    setLoadingList(true);
    try {
      const list = await fetchAll();
      setQrList(list);
    } catch (e) {
      console.error("Error cargando lista:", e);
    } finally {
      setLoadingList(false);
    }
  };

  // Al montar, carga inicial
  useEffect(() => {
    loadList();
  }, []);

  const handleCreated = async (name: string, target: string) => {
    setLoadingOp(true);
    try {
      const qr = await generateQR({ name, target });
      setQrList((prev) => [qr, ...prev]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingOp(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoadingOp(true);
    try {
      await deleteQR(toDelete.code_id);
      setQrList((prev) => prev.filter((q) => q.code_id !== toDelete.code_id));
    } catch {
      alert("No se pudo eliminar");
    } finally {
      setLoadingOp(false);
      setToDelete(null);
    }
  };

  return (
    <main className="container">
      <LoadingOverlay visible={loadingOp} />

      <header>
        <h1>QR Generator</h1>
        <p className="welcome">
          ¡Bienvenido! Genera tus códigos QR personalizados.<br />
          Ingresa un enlace válido y observa la magia.
        </p>
      </header>

      <QRGenerator onCreated={handleCreated} disabled={loadingOp} />

      <section className="list-section">
        <div className="list-header">
          <h2>Tus códigos QR generados:</h2>
          <button
            className="btn-refresh"
            onClick={loadList}
            disabled={loadingList || loadingOp}
          >
            {loadingList ? "Cargando…" : "Recargar"}
          </button>
        </div>

        {loadingList ? (
          <p className="status">Cargando códigos…</p>
        ) : qrList.length > 0 ? (
          <QRList
            list={qrList}
            onView={setSelected}
            onDelete={setToDelete}
            disabled={loadingOp}
          />
        ) : (
          <p className="status">Aún no has generado ningún QR. ¡Vamos!</p>
        )}
      </section>

      {selected && <QRModal qr={selected} onClose={() => setSelected(null)} />}

      {toDelete && (
        <ConfirmModal
          message={`¿Eliminar el QR de "${toDelete.target}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </main>
  );
}
