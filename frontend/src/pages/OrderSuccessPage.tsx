import { Link } from "react-router-dom";

function OrderSuccessPage() {
  return (
    <section className="order-success-page">
      <div className="order-success-card">
        <div className="order-success-card__icon" aria-hidden="true">
          ✓
        </div>

        <h1>Дякуємо за ваше замовлення!</h1>

        <p>Ваше замовлення успішно підтверджено.</p>

        <p>
          Ми отримали інформацію про ваше замовлення та опрацюємо його якомога
          швидше.
        </p>

        <Link to="/" className="order-success-card__button">
          Продовжити покупки
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
