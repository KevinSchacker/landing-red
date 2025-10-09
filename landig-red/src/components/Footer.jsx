// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wrap">
        <div className="footer__brand">
          <img src="/img/logoperfil.png" alt="Red Maker" className="footer__logo" />
          <span>Red Maker Misiones – Oberá</span>
        </div>
        <small className="footer__small">
          © {new Date().getFullYear()} · Todos los derechos reservados
        </small>
      </div>
    </footer>
  );
}
