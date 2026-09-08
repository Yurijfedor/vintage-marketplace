import { Link, useParams } from "react-router-dom";

import { useOrders } from "../features/orders/useOrders";
import { formatPrice } from "../features/products/productFormatters";

function OrderDetailsPage() {
  const { orderId } = useParams();

  const { orders } = useOrders();

  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return (
      <section className="order-details-page">
        <div className="empty-state">
          <h1>Bestellung nicht gefunden</h1>

          <p>Die angeforderte Bestellung konnte nicht gefunden werden.</p>

          <Link to="/orders" className="empty-state__button">
            Zu meinen Bestellungen
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="order-details-page">
      <div className="order-details-page__header">
        <div>
          <Link to="/orders" className="order-details-page__back-link">
            ← Meine Bestellungen
          </Link>

          <h1>Bestellung</h1>

          <p>Bestellnummer: {order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        <span className="order-details-page__status">
          {order.status === "confirmed" ? "Bestätigt" : order.status}
        </span>
      </div>

      <div className="order-details-page__layout">
        <div className="order-details-page__content">
          <section className="order-details-card">
            <h2>Artikel</h2>

            <div className="order-details-items">
              {order.items.map((item) => (
                <article className="order-details-item" key={item.productId}>
                  <img src={item.imageUrl} alt={item.title} />

                  <div className="order-details-item__content">
                    <h3>{item.title}</h3>

                    <p>Verkäufer: {item.sellerName}</p>

                    <span>
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>

                  <strong>{formatPrice(item.quantity * item.price)}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="order-details-card">
            <h2>Lieferadresse</h2>

            <address className="order-details-address">
              <span>
                {order.address.firstName} {order.address.lastName}
              </span>

              <span>{order.address.street}</span>

              <span>
                {order.address.postalCode} {order.address.city}
              </span>
            </address>
          </section>

          <section className="order-details-card">
            <h2>Zahlungsart</h2>

            <p className="order-details-payment">
              {order.paymentMethod === "invoice" && "Rechnung"}

              {order.paymentMethod === "paypal" && "PayPal"}

              {order.paymentMethod === "card" && "Kreditkarte"}
            </p>
          </section>
        </div>

        <aside className="order-details-summary">
          <h2>Bestellübersicht</h2>

          <div className="order-details-summary__row">
            <span>Bestelldatum</span>

            <strong>
              {new Date(order.createdAt).toLocaleDateString("de-DE")}
            </strong>
          </div>

          <div className="order-details-summary__row">
            <span>Artikel</span>

            <strong>{order.totalItems}</strong>
          </div>

          <div className="order-details-summary__total">
            <span>Gesamtsumme</span>

            <strong>{formatPrice(order.totalPrice)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
