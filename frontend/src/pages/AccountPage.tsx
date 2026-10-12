import { Link } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";
import { useProducts } from "../features/products/useProducts";

import "../styles/account.css";

function AccountPage() {
  const { user } = useAuth();
  const { products } = useProducts();

  const sellerProducts = user
    ? products.filter((product) => product.sellerName === user.name)
    : [];

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Мій кабінет</h1>

          <p>Керуйте своїми оголошеннями та переглядайте історію активності.</p>
        </div>
      </div>

      <div className="account-page__grid">
        <Link to="/seller/listings" className="account-card">
          <h2>Мої товари</h2>

          <p>Керуйте своїми активними оголошеннями.</p>

          <span>
            {sellerProducts.length}{" "}
            {sellerProducts.length === 1 ? "товар" : "товарів"}
          </span>
        </Link>

        <Link to="/seller/listings/new" className="account-card">
          <h2>Нове оголошення</h2>

          <p>Додайте новий товар на продаж.</p>
        </Link>

        <Link to="/orders" className="account-card">
          <h2>Мої замовлення</h2>

          <p>Переглядайте попередні замовлення та їхні деталі.</p>
        </Link>
      </div>
    </section>
  );
}

export default AccountPage;
