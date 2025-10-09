// src/components/ProjectModal.jsx
import { useEffect, useRef } from "react";

export default function ProjectModal({ open, onClose, project }) {
  const dialogRef = useRef(null);

  // Cerrar con ESC y foco accesible
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    // manejar focus
    const last = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      last?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !project) return null;

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const hero = gallery[0] || project.image;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Proyecto: ${project.title}`}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content" tabIndex={-1} ref={dialogRef}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="modal__media">
          {hero ? (
            <img
              src={hero}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width="1200"
              height="675"
            />
          ) : null}
        </div>

        <div className="modal__body">
          <h2 className="modal__title">{project.title}</h2>

          {project.descriptionGral ? (
            <p className="modal__desc">{project.descriptionGral}</p>
          ) : (
            <p className="modal__desc">{project.description}</p>
          )}

          {gallery.length > 1 && (
            <div className="modal__gallery">
              {gallery.slice(1).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} imagen ${i + 2}`}
                  loading="lazy"
                  decoding="async"
                  width="360"
                  height="220"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
