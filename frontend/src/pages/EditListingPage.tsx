import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { categories } from "../features/products/categories";
import { useAuth } from "../features/auth/useAuth";
import { useProducts } from "../features/products/useProducts";
import {
  formatCondition,
  formatListingType,
} from "../features/products/productFormatters";
import type {
  AuctionProduct,
  FixedPriceProduct,
  ListingType,
  ProductCondition,
} from "../types/product";

const productConditions: ProductCondition[] = [
  "new",
  "very-good",
  "good",
  "used",
  "damaged",
];

function EditListingPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { products, updateProduct, removeProduct } = useProducts();

  const product = products.find((item) => item.id === productId);

  const [title, setTitle] = useState(product?.title ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [condition, setCondition] = useState<ProductCondition>(
    product?.condition ?? "good",
  );

  const [listingType, setListingType] = useState<ListingType>(
    product?.listingType ?? "fixed-price",
  );

  const [price, setPrice] = useState(
    product?.listingType === "fixed-price" ? String(product.price) : "",
  );

  const [startingPrice, setStartingPrice] = useState(
    product?.listingType === "auction" ? String(product.startingPrice) : "",
  );

  const [auctionEndsAt, setAuctionEndsAt] = useState(
    product?.listingType === "auction"
      ? toDateTimeLocalValue(product.auctionEndsAt)
      : "",
  );

  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  if (!product) {
    return (
      <section className="empty-state">
        <h1>Товар не знайдено</h1>

        <p>Цей товар більше не існує.</p>

        <Link to="/seller/listings" className="empty-state__button">
          Мої оголошення
        </Link>
      </section>
    );
  }

  if (!user || product.sellerName !== user.name) {
    return (
      <section className="empty-state">
        <h1>Доступ заборонено</h1>

        <p>Ви можете редагувати лише власні оголошення.</p>

        <Link to="/seller/listings" className="empty-state__button">
          Мої оголошення
        </Link>
      </section>
    );
  }

  const currentProduct = product;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedTitle = title.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedTitle) {
      setErrorMessage("Введіть назву товару.");
      return;
    }

    if (!category) {
      setErrorMessage("Виберіть категорію.");
      return;
    }

    if (!trimmedImageUrl) {
      setErrorMessage("Введіть URL зображення товару.");
      return;
    }

    if (listingType === "fixed-price") {
      const numericPrice = Number(price);

      if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
        setErrorMessage("Введіть коректну ціну.");
        return;
      }

      const updatedProduct: FixedPriceProduct = {
        id: currentProduct.id,
        title: trimmedTitle,
        category,
        condition,
        listingType: "fixed-price",
        price: numericPrice,
        imageUrl: trimmedImageUrl,
        sellerName: currentProduct.sellerName,
        createdAt: currentProduct.createdAt,
      };

      updateProduct(updatedProduct);
      navigate("/seller/listings");
      return;
    }

    const numericStartingPrice = Number(startingPrice);

    if (
      !startingPrice ||
      !Number.isFinite(numericStartingPrice) ||
      numericStartingPrice <= 0
    ) {
      setErrorMessage("Введіть коректну початкову ціну.");
      return;
    }

    if (!auctionEndsAt) {
      setErrorMessage("Виберіть дату й час завершення аукціону.");
      return;
    }

    const auctionEndDate = new Date(auctionEndsAt);

    if (
      !Number.isFinite(auctionEndDate.getTime()) ||
      auctionEndDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Аукціон має завершуватися в майбутньому.");
      return;
    }

    const currentAuctionData =
      currentProduct.listingType === "auction"
        ? {
            currentBid: currentProduct.currentBid,
            bidCount: currentProduct.bidCount,
          }
        : {
            currentBid: null,
            bidCount: 0,
          };

    const updatedProduct: AuctionProduct = {
      id: currentProduct.id,
      title: trimmedTitle,
      category,
      condition,
      listingType: "auction",
      startingPrice: numericStartingPrice,
      currentBid: currentAuctionData.currentBid,
      bidCount: currentAuctionData.bidCount,
      auctionEndsAt: auctionEndDate.toISOString(),
      imageUrl: trimmedImageUrl,
      sellerName: currentProduct.sellerName,
      createdAt: currentProduct.createdAt,
    };

    updateProduct(updatedProduct);
    navigate("/seller/listings");
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Ви справді хочете видалити це оголошення? Цю дію неможливо скасувати.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeProduct(currentProduct.id);
      navigate("/seller/listings");
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorMessage("Не вдалося видалити оголошення.");
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-page__header">
        <Link to="/seller/listings" className="product-page__back">
          ← Мої оголошення
        </Link>

        <h1>Редагувати оголошення</h1>

        <p>Змініть інформацію про свій товар.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-page__content">
          <section className="checkout-card">
            <h2>Інформація про товар</h2>

            <label>
              Назва товару
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label>
              Категорія
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Стан товару
              <select
                value={condition}
                onChange={(event) =>
                  setCondition(event.target.value as ProductCondition)
                }
              >
                {productConditions.map((item) => (
                  <option key={item} value={item}>
                    {formatCondition(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              URL зображення
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </label>
          </section>

          <section className="checkout-card">
            <h2>Спосіб продажу</h2>

            <label className="checkout-payment-option">
              <input
                type="radio"
                name="listingType"
                value="fixed-price"
                checked={listingType === "fixed-price"}
                onChange={() => setListingType("fixed-price")}
              />
              {formatListingType("fixed-price")}
            </label>

            <label className="checkout-payment-option">
              <input
                type="radio"
                name="listingType"
                value="auction"
                checked={listingType === "auction"}
                onChange={() => setListingType("auction")}
              />
              {formatListingType("auction")}
            </label>

            {listingType === "fixed-price" ? (
              <label>
                Ціна (€)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
            ) : (
              <>
                <label>
                  Початкова ціна (€)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={startingPrice}
                    onChange={(event) => setStartingPrice(event.target.value)}
                  />
                </label>

                <label>
                  Дата й час завершення аукціону
                  <input
                    type="datetime-local"
                    value={auctionEndsAt}
                    onChange={(event) => setAuctionEndsAt(event.target.value)}
                  />
                </label>
              </>
            )}
          </section>

          {errorMessage && (
            <p className="checkout-summary__error">{errorMessage}</p>
          )}

          <div>
            <button type="submit" className="checkout-summary__button">
              Зберегти зміни
            </button>

            <Link to="/seller/listings" className="empty-state__button">
              Скасувати
            </Link>

            <button
              type="button"
              className="seller-listing__delete"
              onClick={handleDelete}
            >
              Видалити оголошення
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function toDateTimeLocalValue(value: string): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offset);

  return localDate.toISOString().slice(0, 16);
}

export default EditListingPage;
