import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../features/cart/useCart";
import { useOrders } from "../features/orders/useOrders";
import { useProducts } from "../features/products/useProducts";
import { formatPrice } from "../features/products/productFormatters";
import type { FixedPriceProduct } from "../types/product";
import type { PaymentMethod } from "../types/order";
import { createOrder as createOrderApi } from "../api/ordersApi";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { products, refreshProducts } = useProducts();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("invoice");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartProducts = cartItems
    .map((cartItem) => {
      const product = products.find(
        (product) => product.id === cartItem.productId,
      );

      if (!product || product.listingType !== "fixed-price") {
        return null;
      }

      return { product, quantity: cartItem.quantity };
    })
    .filter(
      (item): item is { product: FixedPriceProduct; quantity: number } =>
        item !== null,
    );

  const totalItems = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");

    if (cartProducts.length === 0) {
      setErrorMessage("Ваш кошик порожній. Спочатку додайте товари до кошика.");
      return;
    }

    const unavailableItem = cartProducts.find(
      ({ product, quantity }) =>
        product.availableQuantity === 0 || quantity > product.availableQuantity,
    );

    if (unavailableItem) {
      setErrorMessage(
        unavailableItem.product.availableQuantity === 0
          ? `Товар "${unavailableItem.product.title}" більше не доступний.`
          : `Для товару "${unavailableItem.product.title}" доступно лише ${unavailableItem.product.availableQuantity} шт. Змініть кількість у кошику.`,
      );
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !street.trim() ||
      !postalCode.trim() ||
      !city.trim()
    ) {
      setErrorMessage("Будь ласка, заповніть усі поля адреси доставки.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrderApi({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        paymentMethod,
        items: cartProducts.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });

      addOrder(order);
      clearCart();

      try {
        await refreshProducts();
      } catch (error) {
        console.error("Failed to refresh products after checkout:", error);
      }

      navigate("/order-success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося оформити замовлення. Спробуйте ще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-page__header">
        <h1>Оформлення замовлення</h1>
        <p>Перевірте замовлення та введіть дані для доставки.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-page__layout">
          <div className="checkout-page__content">
            <section className="checkout-card">
              <h2>Адреса доставки</h2>

              <div className="checkout-form__row">
                <label>
                  Ім'я
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                  />
                </label>

                <label>
                  Прізвище
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                  />
                </label>
              </div>

              <label>
                Вулиця та номер будинку
                <input
                  type="text"
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                  autoComplete="street-address"
                />
              </label>

              <div className="checkout-form__row">
                <label>
                  Поштовий індекс
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    autoComplete="postal-code"
                  />
                </label>

                <label>
                  Місто
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    autoComplete="address-level2"
                  />
                </label>
              </div>
            </section>

            <section className="checkout-card">
              <h2>Спосіб оплати</h2>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="invoice"
                  checked={paymentMethod === "invoice"}
                  onChange={() => setPaymentMethod("invoice")}
                />
                Оплата за рахунком
              </label>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                PayPal
              </label>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Банківська картка
              </label>

              <p className="checkout-payment-note">
                Вибір способу оплати поки що не запускає реальне списання
                коштів.
              </p>
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>Ваше замовлення</h2>

            <p>
              Кількість товарів: <strong>{totalItems}</strong>
            </p>

            <div className="checkout-summary__items">
              {cartProducts.map(({ product, quantity }) => (
                <div className="checkout-summary__item" key={product.id}>
                  <div>
                    <strong>{product.title}</strong>
                    <span>
                      {quantity} × {formatPrice(product.price)}
                    </span>
                  </div>

                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary__total">
              <span>Разом:</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            {errorMessage && (
              <p className="checkout-summary__error">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="checkout-summary__button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Оформлення замовлення…"
                : "Підтвердити замовлення"}
            </button>
          </aside>
        </div>
      </form>
    </section>
  );
}

export default CheckoutPage;
