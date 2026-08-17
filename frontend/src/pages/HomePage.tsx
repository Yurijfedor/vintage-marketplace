import ProductCard from "../features/products/ProductCard";
import { categories } from "../features/products/categories";
import { mockProducts } from "../features/products/mockProducts";

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1>Entdecken Sie besondere Vintage-Stücke</h1>

          <p>
            Vintage, Sammlerartikel und besondere Fundstücke aus zweiter Hand.
          </p>

          <form className="search-form">
            <input
              type="search"
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
          {categories.map((category) => (
            <button type="button" className="category-chip" key={category}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <h2>Neue Angebote</h2>

          <button type="button" className="section-heading__link">
            Alle ansehen
          </button>
        </div>

        <div className="products-grid">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
