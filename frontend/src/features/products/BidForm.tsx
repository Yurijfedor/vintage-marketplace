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
        <h3>Auktion beendet</h3>
        <p>Für diese Auktion können keine Gebote mehr abgegeben werden.</p>
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
      setError("Bitte geben Sie einen Betrag ein.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Bitte geben Sie einen gültigen Betrag ein.");
      return;
    }

    const minimumBid = getMinimumBid(currentBid);

    if (!isValidBid(numericAmount, currentBid)) {
      setError(
        `Das Mindestgebot beträgt ${minimumBid
          .toFixed(2)
          .replace(".", ",")} €.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onBidSubmit(numericAmount);

      setAmount("");
      setSuccess("Ihr Gebot wurde erfolgreich abgegeben.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Beim Abgeben des Gebots ist ein Fehler aufgetreten.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
            placeholder={`Mindestens ${getMinimumBid(currentBid)
              .toFixed(2)
              .replace(".", ",")} €`}
            aria-label="Ihr Gebot"
            disabled={isSubmitting}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird abgegeben..." : "Gebot abgeben"}
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
