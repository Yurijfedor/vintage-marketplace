import AuctionDetails from "./AuctionDetails";
import { formatCondition, formatPrice } from "./productFormatters";
import type { Product } from "../../types/product";

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="product-page__details">
      <span className="product-card__category">{product.category}</span>

      <h1>{product.title}</h1>

      {product.listingType === "auction" ? (
        <AuctionDetails product={product} />
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
