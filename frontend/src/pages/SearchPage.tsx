import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { filterProducts } from "../features/products/productFilters";
import { mockProducts } from "../features/products/mockProducts";

function SearchPage() {
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("q") ?? "";

  const filteredProducts = useMemo(
    () => filterProducts(mockProducts, searchTerm, null, null),
    [searchTerm],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Suchergebnisse</h1>

          {searchTerm && (
            <p>
              Ergebnisse für: <strong>„{searchTerm}“</strong>
            </p>
          )}
        </div>

        <span className="catalog-page__count">
          {filteredProducts.length} Artikel
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Keine Artikel gefunden</h3>

          <p>Versuchen Sie einen anderen Suchbegriff.</p>
        </div>
      )}
    </section>
  );
}

export default SearchPage;
