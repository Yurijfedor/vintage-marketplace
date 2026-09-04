import { useParams } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { mockProducts } from "../features/products/mockProducts";

function SellerPage() {
  const { sellerName } = useParams<{
    sellerName: string;
  }>();

  const sellerProducts = mockProducts.filter(
    (product) => product.sellerName === sellerName,
  );

  return (
    <section className="seller-page">
      <div className="seller-page__header">
        <div>
          <h1>{sellerName}</h1>

          <p>Alle Artikel dieses Verkäufers.</p>
        </div>

        <span className="seller-page__count">
          {sellerProducts.length}{" "}
          {sellerProducts.length === 1 ? "Artikel" : "Artikel"}
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
          <h2>Keine Artikel gefunden</h2>

          <p>Dieser Verkäufer hat momentan keine aktiven Artikel.</p>
        </div>
      )}
    </section>
  );
}

export default SellerPage;
