import { Link } from "react-router-dom";

import type { Product } from "../../types/product";
import Countdown from "./Countdown";
import { formatListingType, formatPrice } from "./productFormatters";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card__image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-card__image"
          />

          <button
            type="button"
            className="product-card__favorite"
            aria-label="Zu Favoriten hinzufügen"
            onClick={(event) => event.preventDefault()}
          >
            ♡
          </button>
        </div>

        <div className="product-card__content">
          <span className="product-card__category">{product.category}</span>

          <h3 className="product-card__title">{product.title}</h3>

          <div className="product-card__footer">
            <div className="product-card__price-row">
              <strong className="product-card__price">
                {product.listingType === "auction"
                  ? formatPrice(product.currentBid ?? product.startingPrice)
                  : formatPrice(product.price)}
              </strong>

              <span className="product-card__listing-type">
                {formatListingType(product.listingType)}
              </span>
            </div>

            {product.listingType === "auction" && (
              <span className="product-card__auction-info">
                {product.bidCount} {product.bidCount === 1 ? "Gebot" : "Gebote"}
              </span>
            )}

            {product.listingType === "auction" && (
              <Countdown targetDate={product.auctionEndsAt} />
            )}

            <span className="product-card__seller">{product.sellerName}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
