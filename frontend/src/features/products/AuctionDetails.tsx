import { useState } from "react";
import BidForm from "./BidForm";
import Countdown from "./Countdown";
import { useCountdown } from "./useCountdown";
import { formatPrice } from "./productFormatters";
import { createBid } from "../../api/bidsApi";
import type { AuctionProduct } from "../../types/product";

interface AuctionDetailsProps {
  product: AuctionProduct;
}

function AuctionDetails({ product }: AuctionDetailsProps) {
  const initialBid = product.currentBid ?? product.startingPrice;

  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidCount, setBidCount] = useState(product.bidCount);

  const countdown = useCountdown(product.auctionEndsAt);

  async function handleBidSubmit(amount: number) {
    const bid = await createBid(product.id, amount);

    setCurrentBid(bid.amount);
    setBidCount((count) => count + 1);
  }

  return (
    <>
      <strong className="product-page__price">{formatPrice(currentBid)}</strong>

      <p>
        Aktuelles Gebot: <strong>{formatPrice(currentBid)}</strong>
      </p>

      <p>
        Gebote: <strong>{bidCount}</strong>
      </p>

      <Countdown targetDate={product.auctionEndsAt} />

      <BidForm
        currentBid={currentBid}
        onBidSubmit={handleBidSubmit}
        isAuctionActive={!countdown.isExpired}
      />
    </>
  );
}

export default AuctionDetails;
