// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import { fetchCounts } from "./api";
import "./styles.css";

const VOTE_FLAG = 'landing-voto-userId';
const VOTED_ON  = 'landing-voto-already';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // userId persistente (fallback si localStorage falla)
  const userId = useMemo(() => {
    try {
      let id = localStorage.getItem(VOTE_FLAG);
      if (!id) {
        id = (crypto.randomUUID && crypto.randomUUID()) || uuidv4();
        localStorage.setItem(VOTE_FLAG, id);
      }
      return id;
    } catch {
      return (crypto.randomUUID && crypto.randomUUID()) || uuidv4();
    }
  }, []);

  const alreadyVoted = (() => {
    try { return localStorage.getItem(VOTED_ON) === 'true'; }
    catch { return false; }
  })();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/projects.json');
        if (!res.ok) throw new Error('No se pudo cargar /projects.json');
        const p = await res.json();
        setProjects(p.projects || []);
      } catch (e) {
        console.error(e);
        setErr(e.message || 'Error cargando projects.json');
      } finally {
        setLoading(false);
      }

      try {
        const c = await fetchCounts();
        setCounts(c.counts || {});
      } catch (e) {
        console.warn('No se pudo cargar conteo de votos:', e);
      }
    })();
  }, []);

  const refreshCounts = async () => {
    try {
      const c = await fetchCounts();
      setCounts(c.counts || {});
    } catch (e) {
      console.warn(e);
    }
  };

  const handleVoted = async () => {
    try { localStorage.setItem(VOTED_ON, 'true'); } catch {}
    await refreshCounts();
  };

  const openDetails = (project) => {
    setSelected(project);
    setOpen(true);
    // bloquear scroll del body en mobile
    document.documentElement.style.overflow = 'hidden';
  };
  const closeDetails = () => {
    setOpen(false);
    setSelected(null);
    document.documentElement.style.overflow = '';
  };

  return (
    <>
      <Navbar />

      <header className="hero">
        <h1 className="hero__title">Votación de Proyectos Red Maker Oberá</h1>
        <p className="hero__subtitle">
          {alreadyVoted
            ? 'Gracias por participar. Ya registramos tu voto.'
            : 'Elegí tu proyecto favorito (1 voto por persona).'}
        </p>
      </header>

      <main className="container">
        {loading && <p className="loading">Cargando…</p>}
        {err && <p className="error">Error: {err}</p>}

        {!loading && !!projects.length && (
          <section className="grid">
            {projects.map(prj => (
              <ProjectCard
                key={prj.id}
                project={prj}
                votes={counts}
                canVote={!alreadyVoted}
                userId={userId}
                onVoted={handleVoted}
                onOpenDetails={openDetails}  // 👈 pasa handler al card
              />
            ))}
          </section>
        )}

        {!loading && !projects.length && !err && (
          <p className="loading">No hay proyectos para mostrar. Verificá <code>public/projects.json</code>.</p>
        )}
      </main>

      <Footer />

      {/* Modal */}
      <ProjectModal open={open} onClose={closeDetails} project={selected} />
    </>
  );
}
