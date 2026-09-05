import { Link } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { useFavorites } from "../features/favorites/useFavorites";
import { mockProducts } from "../features/products/mockProducts";

function FavoritesPage() {
  const { favoriteProductIds } = useFavorites();

  const favoriteProducts = mockProducts.filter((product) =>
    favoriteProductIds.includes(product.id),
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Favoriten</h1>

          <p>Ihre gespeicherten Vintage- und Sammlerartikel.</p>
        </div>

        {favoriteProducts.length > 0 && (
          <span className="catalog-page__count">
            {favoriteProducts.length} Artikel
          </span>
        )}
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="products-grid catalog-page__products">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Noch keine Favoriten</h3>

          <p>Speichern Sie Artikel, die Sie später wieder ansehen möchten.</p>

          <Link to="/categories" className="empty-state__button">
            Artikel entdecken
          </Link>
        </div>
      )}
    </section>
  );
}

export default FavoritesPage;
