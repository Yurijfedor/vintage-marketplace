interface OrderNotification {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  paymentMethod: string;
  totalItems: number;
  totalPrice: { toNumber(): number } | number;
  items: Array<{
    title: string;
    quantity: number;
    price: { toNumber(): number } | number;
  }>;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function amount(value: { toNumber(): number } | number): number {
  return typeof value === "number" ? value : value.toNumber();
}

export async function sendOrderNotification(
  order: OrderNotification,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram notification skipped: configuration is missing");
    return;
  }

  const items = order.items
    .map(
      (item) =>
        `• ${escapeHtml(item.title)} × ${item.quantity} — ${(amount(item.price) * item.quantity).toFixed(2)} €`,
    )
    .join("\n");

  const total = amount(order.totalPrice).toFixed(2);

  const message = [
    "🛍️ <b>Нове замовлення!</b>",
    `Номер: <code>${escapeHtml(order.id)}</code>`,
    "",
    "<b>Товари:</b>",
    items,
    "",
    `<b>Кількість:</b> ${order.totalItems}`,
    `<b>Сума:</b> ${total} €`,
    `<b>Оплата:</b> ${escapeHtml(order.paymentMethod)}`,
    "",
    "<b>Доставка:</b>",
    `${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)}`,
    `${escapeHtml(order.street)}`,
    `${escapeHtml(order.postalCode)} ${escapeHtml(order.city)}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        signal: AbortSignal.timeout(8000),
      },
    );

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
    } | null;

    if (!response.ok || !result?.ok) {
      console.error("Telegram notification failed:", {
        status: response.status,
        description: result?.description ?? "Unknown Telegram API error",
      });
    }
  } catch (error) {
    console.error("Telegram notification error:", error);
  }
}
