"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectModal({ open, onClose, project }) {
  const dialogRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Cerrar con ESC y foco accesible
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
      if (e.key === "ArrowLeft" && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      }
      if (e.key === "ArrowRight" && currentImageIndex < gallery.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      }
    };
    document.addEventListener("keydown", onKey);
    // manejar focus
    const last = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      last?.focus?.();
    };
  }, [open, onClose, currentImageIndex]);

  if (!open || !project) return null;

  const gallery = Array.isArray(project.gallery) && project.gallery.length > 0 
    ? project.gallery 
    : [project.image];

  const goToPrevious = () => {
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => Math.min(gallery.length - 1, prev + 1));
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Proyecto: ${project.title}`}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content" tabIndex={-1} ref={dialogRef}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="modal__carousel">
          <div className="modal__carousel-container">
            <img
              src={gallery[currentImageIndex] || "/placeholder.svg"}
              alt={`${project.title} - imagen ${currentImageIndex + 1}`}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Botones de navegación - solo si hay más de una imagen */}
          {gallery.length > 1 && (
            <>
              <button
                className="carousel__btn carousel__btn--prev"
                onClick={goToPrevious}
                disabled={currentImageIndex === 0}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                className="carousel__btn carousel__btn--next"
                onClick={goToNext}
                disabled={currentImageIndex === gallery.length - 1}
                aria-label="Imagen siguiente"
              >
                ›
              </button>

              {/* Indicadores de posición */}
              <div className="carousel__indicators">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel__indicator ${index === currentImageIndex ? 'carousel__indicator--active' : ''}`}
                    onClick={() => goToImage(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>

              {/* Contador de imágenes */}
              <div className="carousel__counter">
                {currentImageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        <div className="modal__body">
          <h2 className="modal__title">{project.title}</h2>

          {project.descriptionGral ? (
            <p className="modal__desc">{project.descriptionGral}</p>
          ) : (
            <p className="modal__desc">{project.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
