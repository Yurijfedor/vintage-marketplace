import type { FixedPriceProduct } from "../../types/product";
import { formatPrice } from "../products/productFormatters";

import { useCart } from "./useCart";

interface CartItemProps {
  product: FixedPriceProduct;
  quantity: number;
}

function CartItem({ product, quantity }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <article className="cart-item">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="cart-item__image"
      />

      <div className="cart-item__content">
        <span className="cart-item__category">{product.category}</span>

        <h2 className="cart-item__title">{product.title}</h2>

        <p className="cart-item__seller">Verkäufer: {product.sellerName}</p>

        <strong className="cart-item__price">
          {formatPrice(product.price)}
        </strong>

        <p className="cart-item__subtotal">
          Zwischensumme:{" "}
          <strong>{formatPrice(product.price * quantity)}</strong>
        </p>

        <div className="cart-item__quantity">
          <span>Menge:</span>

          <button
            type="button"
            onClick={() => decreaseQuantity(product.id)}
            aria-label={`${product.title} Menge verringern`}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id)}
            aria-label={`${product.title} Menge erhöhen`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="cart-item__remove"
          onClick={() => removeFromCart(product.id)}
        >
          Entfernen
        </button>
      </div>
    </article>
  );
}

export default CartItem;
