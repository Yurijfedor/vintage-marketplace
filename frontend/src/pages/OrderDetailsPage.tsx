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
          <h1>Замовлення не знайдено</h1>

          <p>Не вдалося знайти запитане замовлення.</p>

          <Link to="/orders" className="empty-state__button">
            До моїх замовлень
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
            ← Мої замовлення
          </Link>

          <h1>Замовлення</h1>

          <p>Номер замовлення: {order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        <span className="order-details-page__status">
          {order.status === "confirmed" ? "Підтверджено" : order.status}
        </span>
      </div>

      <div className="order-details-page__layout">
        <div className="order-details-page__content">
          <section className="order-details-card">
            <h2>Товари</h2>

            <div className="order-details-items">
              {order.items.map((item) => (
                <article className="order-details-item" key={item.productId}>
                  <img src={item.imageUrl} alt={item.title} />

                  <div className="order-details-item__content">
                    <h3>{item.title}</h3>

                    <p>Продавець: {item.sellerName}</p>

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
            <h2>Адреса доставки</h2>

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
            <h2>Спосіб оплати</h2>

            <p className="order-details-payment">
              {order.paymentMethod === "invoice" && "Рахунок"}

              {order.paymentMethod === "paypal" && "PayPal"}

              {order.paymentMethod === "card" && "Банківська картка"}
            </p>
          </section>
        </div>

        <aside className="order-details-summary">
          <h2>Підсумок замовлення</h2>

          <div className="order-details-summary__row">
            <span>Дата замовлення</span>

            <strong>
              {new Date(order.createdAt).toLocaleDateString("uk-UA")}
            </strong>
          </div>

          <div className="order-details-summary__row">
            <span>Кількість товарів</span>

            <strong>{order.totalItems}</strong>
          </div>

          <div className="order-details-summary__total">
            <span>Загальна сума</span>

            <strong>{formatPrice(order.totalPrice)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
