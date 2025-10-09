// src/components/VoteButton.jsx
import { useState } from "react";
import { sendVote } from "../api";
import Toast from "./Toast";

export default function VoteButton({ userId, projectId, disabled, onVoted }) {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const onClick = async () => {
    if (disabled || sending) return;
    try {
      setSending(true);
      const resp = await sendVote({ userId, projectId });
      if (!resp?.ok) {
        const msg = resp?.reason || resp?.error || "No se registró el voto";
        setToast({ message: `⚠️ ${msg}`, type: "error" });
      } else {
        setToast({ message: "✅ ¡Voto registrado!", type: "success" });
        onVoted?.();
      }
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (e) {
      setToast({ message: `⚠️ ${e.message}`, type: "error" });
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        className={`btn ${sending ? "btn--loading" : ""}`}
        onClick={onClick}
        disabled={disabled || sending}
      >
        {sending ? "Enviando…" : "Votar este proyecto"}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
