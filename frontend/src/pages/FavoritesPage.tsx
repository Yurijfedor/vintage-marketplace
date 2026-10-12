import { Link } from "react-router-dom";

import ProductCard from "../features/products/ProductCard";
import { useFavorites } from "../features/favorites/useFavorites";
import { useProducts } from "../features/products/useProducts";

function FavoritesPage() {
  const { favoriteProductIds } = useFavorites();
  const { products } = useProducts();

  const favoriteProducts = products.filter((product) =>
    favoriteProductIds.includes(product.id),
  );

  return (
    <section className="catalog-page">
      <div className="catalog-page__header">
        <div>
          <h1>Обране</h1>

          <p>Збережені вінтажні речі та колекційні товари.</p>
        </div>

        {favoriteProducts.length > 0 && (
          <span className="catalog-page__count">
            {favoriteProducts.length}{" "}
            {favoriteProducts.length === 1 ? "товар" : "товарів"}
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
          <h3>Поки що немає обраних товарів</h3>

          <p>
            Додавайте товари до обраного, щоб зручно переглянути їх пізніше.
          </p>

          <Link to="/categories" className="empty-state__button">
            Переглянути товари
          </Link>
        </div>
      )}
    </section>
  );
}

export default FavoritesPage;
