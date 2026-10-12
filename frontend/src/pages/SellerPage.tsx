import { useParams } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { useProducts } from "../features/products/useProducts";

function SellerPage() {
  const { sellerName } = useParams<{ sellerName: string }>();
  const { products } = useProducts();

  const sellerProducts = products.filter(
    (product) => product.sellerName === sellerName,
  );

  return (
    <section className="seller-page">
      <div className="seller-page__header">
        <div>
          <h1>{sellerName}</h1>
          <p>Усі товари цього продавця.</p>
        </div>

        <span className="seller-page__count">
          {sellerProducts.length}{" "}
          {sellerProducts.length === 1 ? "товар" : "товарів"}
        </span>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="products-grid seller-page__products">
          {sellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Товарів не знайдено</h2>

          <p>У цього продавця наразі немає активних оголошень.</p>
        </div>
      )}
    </section>
  );
}

export default SellerPage;
