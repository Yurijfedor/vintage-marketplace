import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div className="site">
      <Header />

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
