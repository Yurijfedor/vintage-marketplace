import { useMemo } from "react";

import { useCart } from "../features/cart/useCart";
import { mockProducts } from "../features/products/mockProducts";
import CartItem from "../features/cart/CartItem";
import { formatPrice } from "../features/products/productFormatters";

function CartPage() {
  const { cartItems } = useCart();

  const cartProducts = useMemo(
    () =>
      cartItems.flatMap((cartItem) => {
        const product = mockProducts.find(
          (item) => item.id === cartItem.productId,
        );

        if (!product || product.listingType !== "fixed-price") {
          return [];
        }

        return [
          {
            product,
            quantity: cartItem.quantity,
          },
        ];
      }),
    [cartItems],
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
        <h1>Warenkorb</h1>

        <p>
          {cartProducts.length === 0
            ? "Ihr Warenkorb ist leer."
            : `${cartProducts.length} Artikelpositionen im Warenkorb.`}
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
            <h2>Bestellübersicht</h2>

            <p>
              Artikel: <strong>{totalQuantity}</strong>
            </p>

            <p>
              Zwischensumme: <strong>{formatPrice(totalPrice)}</strong>
            </p>

            <p className="cart-summary__total">
              Gesamtsumme: <strong>{formatPrice(totalPrice)}</strong>
            </p>

            <button type="button" className="cart-summary__checkout">
              Zur Kasse
            </button>
          </aside>
        )}
      </div>
    </section>
  );
}

export default CartPage;
