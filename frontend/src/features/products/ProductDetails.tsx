import { useState } from "react";
import BidForm from "./BidForm";
import Countdown from "./Countdown";
import { formatCondition, formatPrice } from "./productFormatters";
import type { Product } from "../../types/product";

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const initialBid =
    product.listingType === "auction"
      ? (product.currentBid ?? product.startingPrice)
      : null;

  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidCount, setBidCount] = useState(
    product.listingType === "auction" ? product.bidCount : 0,
  );

  function handleBidSubmit(amount: number) {
    setCurrentBid(amount);
    setBidCount((count) => count + 1);
  }

  return (
    <div className="product-page__details">
      <span className="product-card__category">{product.category}</span>

      <h1>{product.title}</h1>

      {product.listingType === "auction" ? (
        <>
          <strong className="product-page__price">
            {formatPrice(currentBid ?? product.startingPrice)}
          </strong>

          <p>
            Aktuelles Gebot:{" "}
            <strong>{formatPrice(currentBid ?? product.startingPrice)}</strong>
          </p>

          <p>
            Gebote: <strong>{bidCount}</strong>
          </p>

          <Countdown targetDate={product.auctionEndsAt} />

          {currentBid !== null && (
            <BidForm currentBid={currentBid} onBidSubmit={handleBidSubmit} />
          )}
        </>
      ) : (
        <>
          <strong className="product-page__price">
            {formatPrice(product.price)}
          </strong>

          <p>Festpreis</p>
        </>
      )}

      <p>
        Zustand: <strong>{formatCondition(product.condition)}</strong>
      </p>

      <p>
        Verkäufer: <strong>{product.sellerName}</strong>
      </p>

      {product.listingType === "fixed-price" && (
        <button type="button" className="product-page__button">
          Kaufen
        </button>
      )}
    </div>
  );
}

export default ProductDetails;
