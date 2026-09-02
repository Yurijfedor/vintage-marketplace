import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../features/products/ProductCard";
import ProductFilters from "../features/products/ProductFilters.tsx";
import { categories } from "../features/products/categories";
import { filterProducts } from "../features/products/productFilters";
import { mockProducts } from "../features/products/mockProducts";

function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  const filteredProducts = useMemo(
    () => filterProducts(mockProducts, "", selectedCategory),
    [selectedCategory],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Kategorien</h1>

          <p>Entdecken Sie unsere Vintage- und Sammlerartikel.</p>
        </div>

        <span className="catalog-page__count">
          {filteredProducts.length} Artikel
        </span>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          if (category) {
            setSearchParams({ category });
          } else {
            setSearchParams({});
          }
        }}
      />

      {filteredProducts.length > 0 ? (
        <div className="products-grid catalog-page__products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Keine Artikel gefunden</h3>

          <p>In dieser Kategorie sind momentan keine Artikel verfügbar.</p>
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;
