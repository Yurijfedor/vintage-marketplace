import { Link } from "react-router-dom";
import { useOrders } from "../features/orders/useOrders";

function OrdersPage() {
  const { orders } = useOrders();

  return (
    <section className="orders-page">
      <div className="orders-page__header">
        <h1>Мої замовлення</h1>

        <p>
          {orders.length === 0
            ? "У вас ще немає замовлень."
            : `Усього замовлень: ${orders.length}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>Замовлень поки немає</h2>

          <p>Коли ви оформите замовлення, воно з'явиться тут.</p>

          <Link to="/" className="empty-state__button">
            Перейти до покупок
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card__header">
                <div>
                  <h2>Замовлення</h2>

                  <p>Номер замовлення: {order.id.slice(0, 8).toUpperCase()}</p>
                </div>

                <span className="order-card__status">
                  {order.status === "confirmed" ? "Підтверджено" : order.status}
                </span>
              </div>

              <div className="order-card__meta">
                <span>
                  {new Date(order.createdAt).toLocaleDateString("uk-UA")}
                </span>

                <span>Кількість товарів: {order.totalItems}</span>

                <strong>
                  {order.totalPrice.toLocaleString("uk-UA", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </strong>
              </div>

              <Link
                to={`/orders/${order.id}`}
                className="order-card__details-link"
              >
                Переглянути деталі →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
