import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateAdminOrderStatus } from "../api/ordersApi";
import type { AdminOrder } from "../api/ordersApi";
import type { OrderStatus } from "../types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Підтверджено",
  processing: "В обробці",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("uk-UA");
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const [updatingOrderIds, setUpdatingOrderIds] = useState<string[]>([]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const previousOrder = orders.find((order) => order.id === orderId);

    if (!previousOrder || previousOrder.status === status) {
      return;
    }

    setError("");
    setUpdatingOrderIds((ids) => [...ids, orderId]);

    try {
      const updatedOrder = await updateAdminOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не вдалося змінити статус замовлення.",
      );
    } finally {
      setUpdatingOrderIds((ids) => ids.filter((id) => id !== orderId));
    }
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не вдалося завантажити замовлення.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchOrders() {
      setError("");

      try {
        const data = await getAdminOrders();

        if (active) {
          setOrders(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити замовлення.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("uk-UA");

    return orders
      .filter((order) => {
        const matchesSearch =
          !query ||
          order.user.name.toLocaleLowerCase("uk-UA").includes(query) ||
          order.user.email.toLocaleLowerCase("uk-UA").includes(query) ||
          order.id.toLocaleLowerCase("uk-UA").includes(query);

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sortBy === "date"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : b.totalPrice - a.totalPrice,
      );
  }, [orders, search, statusFilter, sortBy]);

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  );

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <div>
          <h1>Адміністрування замовлень</h1>
          <p>Перегляд усіх замовлень маркетплейсу</p>
        </div>

        <button type="button" onClick={() => void loadOrders()}>
          Оновити
        </button>
      </header>

      {error && (
        <div className="admin-orders-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-orders-summary">
        <div>
          <span>Замовлень у вибірці</span>
          <strong>{filteredOrders.length}</strong>
        </div>
        <div>
          <span>Сума у вибірці</span>
          <strong>{formatPrice(totalRevenue)}</strong>
        </div>
      </section>

      <section className="admin-orders-filters" aria-label="Фільтри замовлень">
        <label>
          Покупець або номер замовлення
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ім’я, email або ID"
          />
        </label>

        <label>
          Статус
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | OrderStatus)
            }
          >
            <option value="all">Усі статуси</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Сортувати за
          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "date" | "amount")
            }
          >
            <option value="date">Датою — нові спочатку</option>
            <option value="amount">Сумою — від більшої</option>
          </select>
        </label>
      </section>

      {loading ? (
        <p>Завантаження замовлень…</p>
      ) : filteredOrders.length === 0 ? (
        <p className="admin-orders-empty">
          {orders.length === 0
            ? "Замовлень поки немає."
            : "За заданими фільтрами замовлень не знайдено."}
        </p>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Замовлення</th>
                <th>Покупець</th>
                <th>Товари</th>
                <th>Оплата</th>
                <th>Статус</th>
                <th>Сума</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td title={order.id}>{order.id.slice(0, 8)}…</td>
                  <td>
                    <strong>{order.user.name}</strong>
                    <br />
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item.productId}>
                        {item.title} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      aria-label={`Статус замовлення ${order.id.slice(0, 8)}`}
                      value={order.status}
                      disabled={updatingOrderIds.includes(order.id)}
                      onChange={(event) =>
                        void handleStatusChange(
                          order.id,
                          event.target.value as OrderStatus,
                        )
                      }
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    {updatingOrderIds.includes(order.id) && (
                      <span role="status"> Збереження…</span>
                    )}
                  </td>
                  <td>{formatPrice(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
