// src/components/LoadingOverlay.tsx
export default function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="overlay">
      <div className="spinner" />
    </div>
  );
}
