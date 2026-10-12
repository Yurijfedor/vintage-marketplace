import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { ProductCondition } from "../types/product";
import {
  sortProducts,
  type ProductSortOption,
} from "../features/products/productSorting";
import ProductCard from "../features/products/ProductCard";
import ProductFilters from "../features/products/ProductFilters.tsx";
import { categories } from "../features/products/categories";
import { filterProducts } from "../features/products/productFilters";
import { useProducts } from "../features/products/useProducts";

function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const conditionParam = searchParams.get("condition");

  const selectedCondition: ProductCondition | null =
    conditionParam === "new" ||
    conditionParam === "very-good" ||
    conditionParam === "good" ||
    conditionParam === "used" ||
    conditionParam === "damaged"
      ? conditionParam
      : null;

  const sortParam = searchParams.get("sort");

  const selectedSort: ProductSortOption =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "newest";

  const { products } = useProducts();

  const filteredProducts = useMemo(
    () => filterProducts(products, "", selectedCategory, selectedCondition),
    [products, selectedCategory, selectedCondition],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, selectedSort),
    [filteredProducts, selectedSort],
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Каталог товарів</h1>

          <p>Відкрийте для себе вінтажні речі та колекційні товари.</p>
        </div>

        <span className="catalog-page__count">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "товар" : "товарів"}
        </span>
      </div>

      <div className="catalog-page__sorting">
        <label htmlFor="product-sort">Сортувати за:</label>

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
          <option value="newest">Спочатку нові</option>
          <option value="price-asc">Спочатку дешевші</option>
          <option value="price-desc">Спочатку дорожчі</option>
        </select>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedCondition={selectedCondition}
        onCategoryChange={(category) => {
          const nextParams = new URLSearchParams(searchParams);

          if (category) {
            nextParams.set("category", category);
          } else {
            nextParams.delete("category");
          }

          setSearchParams(nextParams);
        }}
        onConditionChange={(condition) => {
          const nextParams = new URLSearchParams(searchParams);

          if (condition) {
            nextParams.set("condition", condition);
          } else {
            nextParams.delete("condition");
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
          <h3>Товарів не знайдено</h3>

          <p>У цій категорії наразі немає доступних товарів.</p>
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;
