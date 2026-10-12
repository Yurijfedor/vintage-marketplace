import { Link } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { useAuth } from "../features/auth/useAuth";
import { useProducts } from "../features/products/useProducts";

function SellerListingsPage() {
  const { user } = useAuth();
  const { products } = useProducts();

  const sellerProducts = user
    ? products.filter((product) => product.sellerName === user.name)
    : [];

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Мої оголошення</h1>
          <p>Ваші вінтажні речі та колекційні товари.</p>
        </div>

        <span className="catalog-page__count">
          {sellerProducts.length}{" "}
          {sellerProducts.length === 1 ? "товар" : "товарів"}
        </span>
      </div>

      <div className="seller-listings-page__actions">
        <Link to="/seller/listings/new" className="section-heading__link">
          Створити оголошення
        </Link>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="products-grid catalog-page__products">
          {sellerProducts.map((product) => (
            <div key={product.id} className="seller-listing">
              <ProductCard product={product} />

              <Link
                to={`/seller/listings/${product.id}/edit`}
                className="seller-listing__edit"
              >
                Редагувати
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Поки що немає оголошень</h3>

          <p>Ви ще не опублікували жодного товару.</p>

          <Link to="/seller/listings/new" className="empty-state__button">
            Створити перше оголошення
          </Link>
        </div>
      )}
    </section>
  );
}

export default SellerListingsPage;
