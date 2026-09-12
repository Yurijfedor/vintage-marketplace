import { Link } from "react-router-dom";

import { CURRENT_SELLER_NAME } from "../features/seller/currentSeller";
import { useProducts } from "../features/products/useProducts";

import "../styles/account.css";

function AccountPage() {
  const { products } = useProducts();

  const sellerProducts = products.filter(
    (product) => product.sellerName === CURRENT_SELLER_NAME,
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Mein Bereich</h1>

          <p>
            Verwalten Sie Ihre Angebote und behalten Sie den Überblick über Ihre
            Aktivitäten.
          </p>
        </div>
      </div>

      <div className="account-page__grid">
        <Link to="/seller/listings" className="account-card">
          <h2>Meine Artikel</h2>

          <p>Verwalten Sie Ihre aktiven Angebote.</p>

          <span>{sellerProducts.length} Artikel</span>
        </Link>

        <Link to="/seller/listings/new" className="account-card">
          <h2>Neues Angebot</h2>

          <p>Stellen Sie einen neuen Artikel zum Verkauf ein.</p>
        </Link>

        <Link to="/orders" className="account-card">
          <h2>Meine Bestellungen</h2>

          <p>Sehen Sie Ihre bisherigen Bestellungen und deren Details.</p>
        </Link>
      </div>
    </section>
  );
}

export default AccountPage;
