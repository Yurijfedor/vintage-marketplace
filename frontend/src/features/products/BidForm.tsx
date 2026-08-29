import { useState } from "react";
import type { SubmitEvent } from "react";

interface BidFormProps {
  currentBid: number;
  onBidSubmit: (amount: number) => void;
}

function BidForm({ currentBid, onBidSubmit }: BidFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedAmount = amount.replace(",", ".");
    const numericAmount = Number(normalizedAmount);

    if (!amount.trim()) {
      setError("Bitte geben Sie einen Betrag ein.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Bitte geben Sie einen gültigen Betrag ein.");
      return;
    }

    if (numericAmount <= currentBid) {
      setError(
        `Ihr Gebot muss höher als ${currentBid
          .toFixed(2)
          .replace(".", ",")} € sein.`,
      );
      return;
    }

    onBidSubmit(numericAmount);

    setAmount("");
    setSuccess("Ihr Gebot wurde erfolgreich abgegeben.");
  }

  return (
    <div className="bid-form">
      <h3>Ihr Gebot</h3>

      <form onSubmit={handleSubmit}>
        <div className="bid-form__input-row">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="z. B. 16,00"
            aria-label="Ihr Gebot"
          />

          <button type="submit">Gebot abgeben</button>
        </div>

        {error && (
          <p className="bid-form__message bid-form__message--error">{error}</p>
        )}

        {success && (
          <p className="bid-form__message bid-form__message--success">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}

export default BidForm;
