import { useMemo } from "react";

import ProductCard from "../features/products/ProductCard";
import { mockProducts } from "../features/products/mockProducts";

function AuctionsPage() {
  const auctionProducts = useMemo(
    () => mockProducts.filter((product) => product.listingType === "auction"),
    [],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Auktionen</h1>

          <p>Entdecken Sie laufende Auktionen und geben Sie Ihr Gebot ab.</p>
        </div>

        <span className="catalog-page__count">
          {auctionProducts.length} Auktionen
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
          <h3>Keine laufenden Auktionen</h3>

          <p>Momentan gibt es keine aktiven Auktionen.</p>
        </div>
      )}
    </section>
  );
}

export default AuctionsPage;
