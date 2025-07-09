export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="buttons">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
