import { useState } from "react";
import { Link } from "react-router-dom";

import { useFavorites } from "../favorites/useFavorites";
import { useCart } from "../cart/useCart";
import AuctionDetails from "./AuctionDetails";
import { formatCondition, formatDate, formatPrice } from "./productFormatters";
import type { Product } from "../../types/product";

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showCartConfirmation, setShowCartConfirmation] = useState(false);

  const favorite = isFavorite(product.id);

  function handleAddToCart() {
    addToCart(product.id);
    setShowCartConfirmation(true);
  }

  return (
    <div className="product-page__details">
      <span className="product-card__category">{product.category}</span>

      <h1>{product.title}</h1>

      {product.description && (
        <p className="product-page__description">{product.description}</p>
      )}

      {product.listingType === "auction" ? (
        <AuctionDetails product={product} />
      ) : (
        <>
          <strong className="product-page__price">
            {formatPrice(product.price)}
          </strong>

          <p>Фіксована ціна</p>

          <p>
            {product.availableQuantity > 0
              ? `У наявності: ${product.availableQuantity} шт.`
              : "Немає в наявності"}
          </p>
        </>
      )}

      <p>
        Стан: <strong>{formatCondition(product.condition)}</strong>
      </p>

      <p>
        Продавець:{" "}
        <Link
          to={`/sellers/${encodeURIComponent(product.sellerName)}`}
          className="product-page__seller"
        >
          {product.sellerName}
        </Link>
      </p>

      <p>
        Дата розміщення: <strong>{formatDate(product.createdAt)}</strong>
      </p>

      <button
        type="button"
        className={`product-page__favorite ${
          favorite ? "product-page__favorite--active" : ""
        }`}
        onClick={() => toggleFavorite(product.id)}
      >
        {favorite ? "♥ Видалити з обраного" : "♡ Додати до обраного"}
      </button>

      {product.listingType === "fixed-price" && (
        <button
          type="button"
          className="product-page__button"
          onClick={handleAddToCart}
          disabled={product.availableQuantity === 0}
        >
          {product.availableQuantity === 0 ? "Немає в наявності" : "Купити"}
        </button>
      )}

      {showCartConfirmation && (
        <div
          className="cart-confirmation-overlay"
          onClick={() => setShowCartConfirmation(false)}
        >
          <section
            className="cart-confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-confirmation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="cart-confirmation__close"
              aria-label="Закрити повідомлення"
              onClick={() => setShowCartConfirmation(false)}
            >
              ×
            </button>

            <div className="cart-confirmation__success" aria-hidden="true">
              ✓
            </div>

            <h2 id="cart-confirmation-title">Товар додано до кошика!</h2>

            <div className="cart-confirmation__product">
              <img src={product.imageUrl} alt={product.title} />

              <div>
                <p className="cart-confirmation__product-title">
                  {product.title}
                </p>

                <strong>
                  {formatPrice(
                    product.listingType === "auction"
                      ? (product.currentBid ?? product.startingPrice)
                      : product.price,
                  )}
                </strong>
              </div>
            </div>

            <div className="cart-confirmation__actions">
              <Link
                to="/cart"
                className="product-page__button cart-confirmation__cart-link"
              >
                Перейти до кошика
              </Link>

              <button
                type="button"
                className="cart-confirmation__continue"
                onClick={() => setShowCartConfirmation(false)}
              >
                Продовжити покупки
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
