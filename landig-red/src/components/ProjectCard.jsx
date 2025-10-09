// src/components/ProjectCard.jsx
import VoteButton from "./VoteButton";

export default function ProjectCard({
  project,
  votes = {},
  canVote,
  userId,
  onVoted,
  onOpenDetails, // 👈 NUEVO: callback para abrir modal
}) {
  const count = votes[project.id] || 0;

  return (
    <article className="card">
      <img
        src={project.image}
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

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn--ghost" onClick={() => onOpenDetails?.(project)}>
            Ver más
          </button>
          <VoteButton
            userId={userId}
            projectId={project.id}
            disabled={!canVote}
            onVoted={onVoted}
          />
        </div>
      </div>
    </article>
  );
}
