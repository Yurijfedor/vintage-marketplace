import { useState } from "react";
import type { SubmitEvent } from "react";
import { getMinimumBid, isValidBid } from "./auctionRules";

interface BidFormProps {
  currentBid: number;
  onBidSubmit: (amount: number) => void;
  isAuctionActive: boolean;
}

function BidForm({ currentBid, onBidSubmit, isAuctionActive }: BidFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuctionActive) {
    return (
      <div className="bid-form bid-form--ended">
        <h3>Auktion beendet</h3>

        <p>Für diese Auktion können keine Gebote mehr abgegeben werden.</p>
      </div>
    );
  }

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

    const minimumBid = getMinimumBid(currentBid);

    if (!isValidBid(numericAmount, currentBid)) {
      setError(
        `Das Mindestgebot beträgt ${minimumBid
          .toFixed(2)
          .replace(".", ",")} €.`,
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
            placeholder={`Mindestens ${getMinimumBid(currentBid)
              .toFixed(2)
              .replace(".", ",")} €`}
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
