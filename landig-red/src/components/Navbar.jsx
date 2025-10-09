// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img
          src="/img/logoperfil.png"
          alt="Red Maker Oberá"
          className="navbar__logo"
          width="56"
          height="56"
        />
        <span className="navbar__title">Red Maker Oberá</span>
      </div>
      <a
        href="https://www.redmakermisiones.com.ar"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar__link"
      >
        Sitio oficial
      </a>
    </nav>
  );
}
