import { useMemo } from "react";

import ProductCard from "../features/products/ProductCard";
import { useProducts } from "../features/products/useProducts";

function AuctionsPage() {
  const { products } = useProducts();

  const auctionProducts = useMemo(
    () => products.filter((product) => product.listingType === "auction"),
    [products],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Аукціони</h1>

          <p>Переглядайте активні аукціони та робіть свої ставки.</p>
        </div>

        <span className="catalog-page__count">
          {auctionProducts.length}{" "}
          {auctionProducts.length === 1 ? "аукціон" : "аукціонів"}
        </span>
      </div>

      {auctionProducts.length > 0 ? (
        <div className="products-grid">
          {auctionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Наразі немає активних аукціонів</h3>

          <p>Коли з'являться нові аукціони, вони відображатимуться тут.</p>
        </div>
      )}
    </section>
  );
}

export default AuctionsPage;
