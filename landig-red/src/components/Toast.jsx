// src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div role="status" aria-live="polite" className={`toast toast--${type}`}>
      {message}
    </div>
  );
}
