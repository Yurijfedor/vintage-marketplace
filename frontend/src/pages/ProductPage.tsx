import { Link, useParams } from "react-router-dom";
import { mockProducts } from "../features/products/mockProducts";

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();

  const product = mockProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <section>
        <h1>Artikel nicht gefunden</h1>
        <Link to="/">Zur Startseite</Link>
      </section>
    );
  }

  return (
    <section className="product-page">
      <Link to="/" className="product-page__back">
        ← Zurück
      </Link>

      <div className="product-page__content">
        <div className="product-page__image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-page__image"
          />
        </div>

        <div className="product-page__details">
          <span className="product-card__category">{product.category}</span>

          <h1>{product.title}</h1>

          <strong className="product-page__price">
            {product.listingType === "auction"
              ? `${(product.currentBid ?? product.startingPrice)
                  .toFixed(2)
                  .replace(".", ",")} €`
              : `${product.price.toFixed(2).replace(".", ",")} €`}
          </strong>

          {product.listingType === "auction" ? (
            <p>
              Aktuelles Gebot:{" "}
              <strong>
                {(product.currentBid ?? product.startingPrice)
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </strong>
            </p>
          ) : (
            <p>Festpreis</p>
          )}

          {product.listingType === "auction" && (
            <p>
              Gebote: <strong>{product.bidCount}</strong>
            </p>
          )}

          <p>
            Verkäufer: <strong>{product.sellerName}</strong>
          </p>

          <p>
            Zustand: <strong>{product.condition}</strong>
          </p>

          <button type="button" className="product-page__button">
            Kaufen
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
