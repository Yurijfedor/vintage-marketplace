import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useFavorites } from "../features/favorites/useFavorites";
import { useCart } from "../features/cart/useCart";
import { useAuth } from "../features/auth/useAuth";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { favoriteProductIds } = useFavorites();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="site-header">
      <div className="site-header__top">
        <Link to="/" className="site-logo">
          Вінтажна крамничка
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Що шукаєте?"
            aria-label="Пошук"
          />

          <button type="submit" aria-label="Шукати">
            Знайти
          </button>
        </form>

        <div className="site-header__actions">
          <Link
            to="/favorites"
            className="header-action"
            aria-label={`Обране (${favoriteProductIds.length})`}
          >
            {favoriteProductIds.length > 0 ? "♥" : "♡"}

            {favoriteProductIds.length > 0 && (
              <span className="header-action__count">
                {favoriteProductIds.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="header-action"
            aria-label={`Кошик (${cartItemsCount})`}
          >
            🛒
            {cartItemsCount > 0 && (
              <span className="header-action__count">{cartItemsCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/seller/listings" className="header-login">
                Мої оголошення
              </Link>

              <Link to="/account" className="header-login">
                {user?.name || "Мій кабінет"}
              </Link>

              <button
                type="button"
                className="header-login"
                onClick={handleLogout}
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="header-login"
              >
                Увійти
              </Link>

              <Link to="/register" className="header-login">
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="site-header__navigation">
        <Link to="/categories">Категорії</Link>
        <Link to="/auctions">Аукціони</Link>
        <Link to="/categories">Новинки</Link>
        <Link to="/favorites">Популярне</Link>
      </nav>
    </header>
  );
}

export default Header;
