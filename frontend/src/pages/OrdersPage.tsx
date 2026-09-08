import { useOrders } from "../features/orders/useOrders";

function OrdersPage() {
  const { orders } = useOrders();

  return (
    <section className="orders-page">
      <div className="orders-page__header">
        <h1>Meine Bestellungen</h1>

        <p>
          {orders.length === 0
            ? "Sie haben noch keine Bestellungen."
            : `${orders.length} ${
                orders.length === 1 ? "Bestellung" : "Bestellungen"
              }`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>Noch keine Bestellungen</h2>

          <p>Sobald Sie eine Bestellung aufgeben, wird sie hier angezeigt.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card__header">
                <div>
                  <h2>Bestellung</h2>

                  <p>Bestellnummer: {order.id.slice(0, 8).toUpperCase()}</p>
                </div>

                <span className="order-card__status">
                  {order.status === "confirmed" ? "Bestätigt" : order.status}
                </span>
              </div>

              <div className="order-card__meta">
                <span>
                  {new Date(order.createdAt).toLocaleDateString("de-DE")}
                </span>

                <span>
                  {order.totalItems}{" "}
                  {order.totalItems === 1 ? "Artikel" : "Artikel"}
                </span>

                <strong>{order.totalPrice.toFixed(2)} €</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
