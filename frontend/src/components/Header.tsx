import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__top">
        <Link to="/" className="site-logo">
          Vintage
        </Link>

        <form className="header-search">
          <input
            type="search"
            placeholder="Was suchen Sie?"
            aria-label="Suche"
          />

          <button type="submit" aria-label="Suchen">
            Suchen
          </button>
        </form>

        <div className="site-header__actions">
          <button
            type="button"
            className="header-action"
            aria-label="Favoriten"
          >
            ♡
          </button>

          <button
            type="button"
            className="header-action"
            aria-label="Warenkorb"
          >
            🛒
          </button>

          <Link to="/login" className="header-login">
            Anmelden
          </Link>
        </div>
      </div>

      <nav className="site-header__navigation">
        <Link to="/categories">Kategorien</Link>

        <Link to="/auctions">Auktionen</Link>

        <Link to="/categories">Neu eingestellt</Link>

        <Link to="/categories">Beliebt</Link>
      </nav>
    </header>
  );
}

export default Header;
