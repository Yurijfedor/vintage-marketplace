import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-card__image"
        />

        <button
          type="button"
          className="product-card__favorite"
          aria-label="Zu Favoriten hinzufügen"
        >
          ♡
        </button>
      </div>

      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>

        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__footer">
          <strong className="product-card__price">
            {product.price.toFixed(2).replace(".", ",")} €
          </strong>

          <span className="product-card__seller">{product.sellerName}</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
