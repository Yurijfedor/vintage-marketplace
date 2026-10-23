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

        <p className="cart-item__seller">Продавець: {product.sellerName}</p>

        <p>
          {product.availableQuantity > 0
            ? `Доступно: ${product.availableQuantity} шт.`
            : "Немає в наявності"}
        </p>

        <strong className="cart-item__price">
          {formatPrice(product.price)}
        </strong>

        <p className="cart-item__subtotal">
          Проміжна сума:{" "}
          <strong>{formatPrice(product.price * quantity)}</strong>
        </p>

        <div className="cart-item__quantity">
          <span>Кількість:</span>

          <button
            type="button"
            onClick={() => decreaseQuantity(product.id)}
            aria-label={`Зменшити кількість товару «${product.title}»`}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={() => increaseQuantity(product.id)}
            aria-label={`Збільшити кількість товару «${product.title}»`}
            disabled={quantity >= product.availableQuantity}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cart-item__remove"
          onClick={() => removeFromCart(product.id)}
        >
          Видалити з кошика
        </button>
      </div>
    </article>
  );
}

export default CartItem;
