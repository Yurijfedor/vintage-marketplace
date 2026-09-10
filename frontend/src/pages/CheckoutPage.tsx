import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/cart/useCart";
import { useOrders } from "../features/orders/useOrders";
import { useProducts } from "../features/products/useProducts";
import { formatPrice } from "../features/products/productFormatters";
import type { FixedPriceProduct } from "../types/product";
import type { Order, PaymentMethod } from "../types/order";
function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { products } = useProducts();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("invoice");
  const [errorMessage, setErrorMessage] = useState("");
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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (cartProducts.length === 0) {
      setErrorMessage(
        "Ihr Warenkorb ist leer. Bitte fügen Sie zuerst Artikel hinzu.",
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
      setErrorMessage("Bitte füllen Sie alle Felder der Lieferadresse aus.");
      return;
    }
    const order: Order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      address: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      },
      paymentMethod,
      items: cartProducts.map(({ product, quantity }) => ({
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        sellerName: product.sellerName,
        quantity,
        price: product.price,
      })),
      totalItems,
      totalPrice,
    };
    addOrder(order);
    clearCart();
    navigate("/order-success");
  }
  return (
    <section className="checkout-page">
      {" "}
      <div className="checkout-page__header">
        {" "}
        <h1>Zur Kasse</h1>{" "}
        <p>Überprüfen Sie Ihre Bestellung und geben Sie Ihre Daten ein.</p>{" "}
      </div>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <div className="checkout-page__layout">
          {" "}
          <div className="checkout-page__content">
            {" "}
            <section className="checkout-card">
              {" "}
              <h2>Lieferadresse</h2>{" "}
              <div className="checkout-form__row">
                {" "}
                <label>
                  {" "}
                  Vorname{" "}
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Nachname{" "}
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />{" "}
                </label>{" "}
              </div>{" "}
              <label>
                {" "}
                Straße und Hausnummer{" "}
                <input
                  type="text"
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                />{" "}
              </label>{" "}
              <div className="checkout-form__row">
                {" "}
                <label>
                  {" "}
                  PLZ{" "}
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Ort{" "}
                  <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />{" "}
                </label>{" "}
              </div>{" "}
            </section>{" "}
            <section className="checkout-card">
              {" "}
              <h2>Zahlungsart</h2>{" "}
              <label className="checkout-payment-option">
                {" "}
                <input
                  type="radio"
                  name="paymentMethod"
                  value="invoice"
                  checked={paymentMethod === "invoice"}
                  onChange={() => setPaymentMethod("invoice")}
                />{" "}
                Rechnung{" "}
              </label>{" "}
              <label className="checkout-payment-option">
                {" "}
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />{" "}
                PayPal{" "}
              </label>{" "}
              <label className="checkout-payment-option">
                {" "}
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />{" "}
                Kreditkarte{" "}
              </label>{" "}
            </section>{" "}
          </div>{" "}
          <aside className="checkout-summary">
            {" "}
            <h2>Bestellübersicht</h2>{" "}
            <p>
              {" "}
              Artikel: <strong>{totalItems}</strong>{" "}
            </p>{" "}
            <div className="checkout-summary__items">
              {" "}
              {cartProducts.map(({ product, quantity }) => (
                <div className="checkout-summary__item" key={product.id}>
                  {" "}
                  <div>
                    {" "}
                    <strong>{product.title}</strong>{" "}
                    <span>
                      {" "}
                      {quantity} × {formatPrice(product.price)}{" "}
                    </span>{" "}
                  </div>{" "}
                  <strong>{formatPrice(product.price * quantity)}</strong>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="checkout-summary__total">
              {" "}
              <span>Gesamtsumme:</span>{" "}
              <strong>{formatPrice(totalPrice)}</strong>{" "}
            </div>{" "}
            {errorMessage && (
              <p className="checkout-summary__error">{errorMessage}</p>
            )}{" "}
            <button type="submit" className="checkout-summary__button">
              {" "}
              Bestellung bestätigen{" "}
            </button>{" "}
          </aside>{" "}
        </div>{" "}
      </form>{" "}
    </section>
  );
}
export default CheckoutPage;
