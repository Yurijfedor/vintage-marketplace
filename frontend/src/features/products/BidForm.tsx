import { useState } from "react";
import type { SubmitEvent } from "react";

import { getMinimumBid, isValidBid } from "./auctionRules";

interface BidFormProps {
  currentBid: number;
  onBidSubmit: (amount: number) => Promise<void>;
  isAuctionActive: boolean;
}

function BidForm({ currentBid, onBidSubmit, isAuctionActive }: BidFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuctionActive) {
    return (
      <div className="bid-form bid-form--ended">
        <h3>Аукціон завершено</h3>
        <p>Для цього аукціону більше не можна робити ставки.</p>
      </div>
    );
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setSuccess("");

    const normalizedAmount = amount.replace(",", ".");
    const numericAmount = Number(normalizedAmount);

    if (!amount.trim()) {
      setError("Введіть суму ставки.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Введіть коректну суму ставки.");
      return;
    }

    const minimumBid = getMinimumBid(currentBid);

    if (!isValidBid(numericAmount, currentBid)) {
      setError(
        `Мінімальна ставка — ${minimumBid.toFixed(2).replace(".", ",")} €.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onBidSubmit(numericAmount);

      setAmount("");
      setSuccess("Вашу ставку успішно подано.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Під час подання ставки сталася помилка.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bid-form">
      <h3>Ваша ставка</h3>

      <form onSubmit={handleSubmit}>
        <div className="bid-form__input-row">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={`Мінімум ${getMinimumBid(currentBid)
              .toFixed(2)
              .replace(".", ",")} €`}
            aria-label="Ваша ставка"
            disabled={isSubmitting}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Надсилання..." : "Зробити ставку"}
          </button>
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
