import { Link } from "react-router-dom";
import ProductCard from "../features/products/ProductCard";
import { useProducts } from "../features/products/useProducts";
import { CURRENT_SELLER_NAME } from "../features/seller/currentSeller";
function SellerListingsPage() {
  const { products } = useProducts();
  const sellerProducts = products.filter(
    (product) => product.sellerName === CURRENT_SELLER_NAME,
  );
  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Meine Artikel</h1>
          <p>Ihre aktiven Vintage- und Sammlerartikel.</p>
        </div>
        <span className="catalog-page__count">
          {sellerProducts.length} Artikel
        </span>
      </div>
      <div className="seller-listings-page__actions">
        <Link to="/seller/listings/new" className="section-heading__link">
          Artikel einstellen
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
                Bearbeiten
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Noch keine Artikel</h3>
          <p>Sie haben momentan keine aktiven Artikel eingestellt.</p>
          <Link to="/seller/listings/new" className="empty-state__button">
            Ersten Artikel einstellen
          </Link>
        </div>
      )}
    </section>
  );
}
export default SellerListingsPage;
