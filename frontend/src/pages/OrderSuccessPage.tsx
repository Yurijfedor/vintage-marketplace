import { Link } from "react-router-dom";

function OrderSuccessPage() {
  return (
    <section className="order-success-page">
      <div className="order-success-card">
        <div className="order-success-card__icon" aria-hidden="true">
          ✓
        </div>

        <h1>Vielen Dank für Ihre Bestellung!</h1>

        <p>Ihre Bestellung wurde erfolgreich bestätigt.</p>

        <p>
          Wir haben Ihre Bestellübersicht erhalten und bearbeiten Ihre
          Bestellung so schnell wie möglich.
        </p>

        <Link to="/" className="order-success-card__button">
          Weiter einkaufen
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccessPage;
