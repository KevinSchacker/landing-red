// src/components/ProjectCard.jsx
import VoteButton from "./VoteButton";

/**
 * Soporta srcSet opcional:
 * - project.image        (400w)
 * - project.image2x      (800w)  opcional
 * - project.image3x      (1200w) opcional
 */
export default function ProjectCard({ project, votes = {}, canVote, userId, onVoted }) {
  const count = votes[project.id] || 0;

  // Construimos srcSet dinámico si hay variantes disponibles
  const srcSet = [
    project.image && `${project.image} 400w`,
    project.image2x && `${project.image2x} 800w`,
    project.image3x && `${project.image3x} 1200w`,
  ]
    .filter(Boolean)
    .join(", ");

  // Sugerencia de tamaños por breakpoint (mejora nitidez/peso en retina)
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <article className="card">
      <img
        src={project.image}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={project.title}
        loading="lazy"
        decoding="async"
        width="400"
        height="200"
      />

      <div className="content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>

      <div className="stats">
        <span className="badge">{count} votos</span>

        <VoteButton
          userId={userId}
          projectId={project.id}
          disabled={!canVote}
          onVoted={onVoted}
        />
      </div>
    </article>
  );
}
