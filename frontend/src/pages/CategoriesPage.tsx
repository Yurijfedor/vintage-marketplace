import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  sortProducts,
  type ProductSortOption,
} from "../features/products/productSorting";
import ProductCard from "../features/products/ProductCard";
import ProductFilters from "../features/products/ProductFilters.tsx";
import { categories } from "../features/products/categories";
import { filterProducts } from "../features/products/productFilters";
import { mockProducts } from "../features/products/mockProducts";

function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  const sortParam = searchParams.get("sort");

  const selectedSort: ProductSortOption =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "newest";

  const filteredProducts = useMemo(
    () => filterProducts(mockProducts, "", selectedCategory),
    [selectedCategory],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, selectedSort),
    [filteredProducts, selectedSort],
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

      <div className="catalog-page__sorting">
        <label htmlFor="product-sort">Sortieren nach:</label>

        <select
          id="product-sort"
          value={selectedSort}
          onChange={(event) => {
            const sort = event.target.value as ProductSortOption;

            const nextParams = new URLSearchParams(searchParams);

            nextParams.set("sort", sort);

            setSearchParams(nextParams);
          }}
        >
          <option value="newest">Neueste zuerst</option>

          <option value="price-asc">Preis: niedrig zuerst</option>

          <option value="price-desc">Preis: hoch zuerst</option>
        </select>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          const nextParams = new URLSearchParams(searchParams);

          if (category) {
            nextParams.set("category", category);
          } else {
            nextParams.delete("category");
          }

          setSearchParams(nextParams);
        }}
      />

      {filteredProducts.length > 0 ? (
        <div className="products-grid catalog-page__products">
          {sortedProducts.map((product) => (
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
