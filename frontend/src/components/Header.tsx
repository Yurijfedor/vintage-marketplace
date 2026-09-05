import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../features/favorites/useFavorites";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { favoriteProductIds } = useFavorites();

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="site-header">
      <div className="site-header__top">
        <Link to="/" className="site-logo">
          Vintage
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Was suchen Sie?"
            aria-label="Suche"
          />

          <button type="submit" aria-label="Suchen">
            Suchen
          </button>
        </form>

        <div className="site-header__actions">
          <Link
            to="/favorites"
            className="header-action"
            aria-label={`Favoriten (${favoriteProductIds.length})`}
          >
            {favoriteProductIds.length > 0 ? "♥" : "♡"}

            {favoriteProductIds.length > 0 && (
              <span className="header-action__count">
                {favoriteProductIds.length}
              </span>
            )}
          </Link>

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
