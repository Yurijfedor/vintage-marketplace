import { useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { categories } from "../features/products/categories";
import { filterProducts } from "../features/products/productFilters";
import { useProducts } from "../features/products/useProducts";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const navigate = useNavigate();
  const { products } = useProducts();

  const filteredProducts = useMemo(
    () => filterProducts(products, "", selectedCategory, null),
    [products, selectedCategory],
  );

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleCategoryClick(category: string) {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? null : category,
    );
  }

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedCategory(null);
  }

  const hasFilters = selectedCategory !== null;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1>Відкрийте для себе особливі вінтажні речі</h1>

          <p>
            Вінтажні знахідки, предмети колекціонування та речі з історією —
            кожна з них має свій характер.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Що шукаєте?"
              aria-label="Пошук товарів"
            />

            <button type="submit">Знайти</button>
          </form>
        </div>

        <div className="hero__gallery" aria-hidden="true">
          {products.slice(0, 3).map((product, index) => (
            <img
              key={product.id}
              src={product.imageUrl}
              alt=""
              className={`hero__image hero__image--${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <h2>Категорії</h2>
        </div>

        <div className="categories-list">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                type="button"
                className={`category-chip ${
                  isSelected ? "category-chip--selected" : ""
                }`}
                key={category}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <h2>{hasFilters ? "Результати пошуку" : "Нові надходження"}</h2>

            {hasFilters && (
              <p className="results-info">
                Знайдено товарів: {filteredProducts.length}
              </p>
            )}
          </div>

          {hasFilters && (
            <button
              type="button"
              className="section-heading__link"
              onClick={handleResetFilters}
            >
              Скинути фільтри
            </button>
          )}
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

            <p>Спробуйте змінити пошуковий запит або вибрати іншу категорію.</p>

            <button
              type="button"
              className="empty-state__button"
              onClick={handleResetFilters}
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
