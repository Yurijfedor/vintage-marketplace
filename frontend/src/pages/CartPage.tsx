import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../features/cart/useCart";
import CartItem from "../features/cart/CartItem";
import { formatPrice } from "../features/products/productFormatters";
import { useProducts } from "../features/products/useProducts";

function CartPage() {
  const { cartItems } = useCart();
  const { products } = useProducts();

  const cartProducts = useMemo(
    () =>
      cartItems.flatMap((cartItem) => {
        const product = products.find((item) => item.id === cartItem.productId);

        if (!product || product.listingType !== "fixed-price") {
          return [];
        }

        return [{ product, quantity: cartItem.quantity }];
      }),
    [cartItems, products],
  );

  const totalQuantity = useMemo(
    () =>
      cartProducts.reduce((total, cartItem) => total + cartItem.quantity, 0),
    [cartProducts],
  );

  const totalPrice = useMemo(
    () =>
      cartProducts.reduce(
        (total, { product, quantity }) => total + product.price * quantity,
        0,
      ),
    [cartProducts],
  );

  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <h1>Кошик</h1>

        <p>
          {cartProducts.length === 0
            ? "Ваш кошик порожній."
            : `Позицій у кошику: ${cartProducts.length}.`}
        </p>
      </div>

      <div className="cart-page__content">
        {cartProducts.length > 0 && (
          <div className="cart-page__items">
            {cartProducts.map(({ product, quantity }) => (
              <CartItem
                key={product.id}
                product={product}
                quantity={quantity}
              />
            ))}
          </div>
        )}

        {cartProducts.length > 0 && (
          <aside className="cart-summary">
            <h2>Підсумок замовлення</h2>

            <p>
              Кількість товарів: <strong>{totalQuantity}</strong>
            </p>

            <p>
              Проміжна сума: <strong>{formatPrice(totalPrice)}</strong>
            </p>

            <p className="cart-summary__total">
              Разом: <strong>{formatPrice(totalPrice)}</strong>
            </p>

            <Link to="/checkout" className="cart-summary__checkout">
              Перейти до оформлення
            </Link>
          </aside>
        )}

        {cartProducts.length === 0 && (
          <div className="empty-state">
            <h2>У кошику поки немає товарів</h2>
            <p>Знайдіть щось особливе у нашій вінтажній крамничці.</p>
            <Link to="/" className="empty-state__button">
              Продовжити покупки
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
