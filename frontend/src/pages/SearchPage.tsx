import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { filterProducts } from "../features/products/productFilters";
import { useProducts } from "../features/products/useProducts";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";

  const { products } = useProducts();

  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm, null, null),
    [products, searchTerm],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Результати пошуку</h1>

          {searchTerm && (
            <p>
              Результати за запитом: <strong>«{searchTerm}»</strong>
            </p>
          )}
        </div>

        <span className="catalog-page__count">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "товар" : "товарів"}
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
          <h3>Товарів не знайдено</h3>

          <p>Спробуйте ввести інший пошуковий запит.</p>
        </div>
      )}
    </section>
  );
}

export default SearchPage;
