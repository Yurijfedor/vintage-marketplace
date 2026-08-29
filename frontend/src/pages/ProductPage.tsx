import { Link, useParams } from "react-router-dom";

import ProductDetails from "../features/products/ProductDetails";
import { mockProducts } from "../features/products/mockProducts";

function ProductPage() {
  const { productId } = useParams<{
    productId: string;
  }>();

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

        <ProductDetails product={product} />
      </div>
    </section>
  );
}

export default ProductPage;
