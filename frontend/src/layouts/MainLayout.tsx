import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-logo">
            Vintage Marketplace
          </Link>

          <nav className="site-nav">
            <Link to="/categories">Kategorien</Link>
            <Link to="/auctions">Auktionen</Link>
            <Link to="/about">Über uns</Link>
          </nav>

          <div className="site-header__actions">
            <Link to="/login">Anmelden</Link>
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>© 2026 Vintage Marketplace</p>
      </footer>
    </div>
  );
}

export default MainLayout;
