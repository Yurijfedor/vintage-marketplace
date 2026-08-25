import { useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import ProductCard from "../features/products/ProductCard";
import { categories } from "../features/products/categories";
import { filterProducts } from "../features/products/productFilters";
import { mockProducts } from "../features/products/mockProducts";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () => filterProducts(mockProducts, submittedSearch, selectedCategory),
    [submittedSearch, selectedCategory],
  );

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(searchTerm);
  }

  function handleCategoryClick(category: string) {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? null : category,
    );
  }

  function handleResetFilters() {
    setSearchTerm("");
    setSubmittedSearch("");
    setSelectedCategory(null);
  }

  const hasFilters = submittedSearch.length > 0 || selectedCategory !== null;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1>Entdecken Sie besondere Vintage-Stücke</h1>

          <p>
            Vintage, Sammlerartikel und besondere Fundstücke aus zweiter Hand.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Was suchen Sie?"
              aria-label="Suche"
            />

            <button type="submit">Suchen</button>
          </form>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <h2>Kategorien</h2>
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
            <h2>{hasFilters ? "Suchergebnisse" : "Neue Angebote"}</h2>

            {hasFilters && (
              <p className="results-info">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "Artikel" : "Artikel"} gefunden
              </p>
            )}
          </div>

          {hasFilters && (
            <button
              type="button"
              className="section-heading__link"
              onClick={handleResetFilters}
            >
              Filter zurücksetzen
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
            <h3>Keine Artikel gefunden</h3>

            <p>
              Versuchen Sie einen anderen Suchbegriff oder eine andere
              Kategorie.
            </p>

            <button
              type="button"
              className="empty-state__button"
              onClick={handleResetFilters}
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
