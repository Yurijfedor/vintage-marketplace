import { Link } from "react-router-dom";
import AuctionDetails from "./AuctionDetails";
import { formatCondition, formatDate, formatPrice } from "./productFormatters";
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
        Verkäufer:{" "}
        <Link
          to={`/sellers/${encodeURIComponent(product.sellerName)}`}
          className="product-page__seller"
        >
          {product.sellerName}
        </Link>
      </p>

      <p>
        Eingestellt am: <strong>{formatDate(product.createdAt)}</strong>
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
