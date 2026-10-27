import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { categories } from "../features/products/categories";
import { useAuth } from "../features/auth/useAuth";
import { useProducts } from "../features/products/useProducts";
import { uploadProductImage } from "../api/uploadsApi";
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

import "../styles/create-product.css";

const productConditions: ProductCondition[] = [
  "new",
  "very-good",
  "good",
  "used",
  "damaged",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function EditListingPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { products, updateProduct, removeProduct } = useProducts();

  const product = products.find((item) => item.id === productId);

  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
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

  const [stockQuantity, setStockQuantity] = useState(
    product?.listingType === "fixed-price"
      ? String(product.stockQuantity)
      : "1",
  );

  const [startingPrice, setStartingPrice] = useState(
    product?.listingType === "auction" ? String(product.startingPrice) : "",
  );

  const [auctionEndsAt, setAuctionEndsAt] = useState(
    product?.listingType === "auction"
      ? toDateTimeLocalValue(product.auctionEndsAt)
      : "",
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl] = useState(product?.imageUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setErrorMessage("");

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageFile(null);
      event.target.value = "";
      setErrorMessage("Оберіть зображення у форматі JPG, PNG або WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageFile(null);
      event.target.value = "";
      setErrorMessage("Розмір фотографії не повинен перевищувати 10 МБ.");
      return;
    }

    setImageFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isDeleting) return;

    setErrorMessage("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("Введіть назву товару.");
      return;
    }

    if (!category) {
      setErrorMessage("Виберіть категорію.");
      return;
    }

    if (!imageUrl.trim() && !imageFile) {
      setErrorMessage("Оберіть фотографію товару.");
      return;
    }

    let numericPrice: number | undefined;
    let numericStartingPrice: number | undefined;
    let auctionEndDate: Date | undefined;

    if (listingType === "fixed-price") {
      numericPrice = Number(price);

      if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
        setErrorMessage("Введіть коректну ціну.");
        return;
      }
      const numericStockQuantity = Number(stockQuantity);

      if (
        stockQuantity.trim() === "" ||
        !Number.isInteger(numericStockQuantity) ||
        numericStockQuantity < 0
      ) {
        setErrorMessage("Введіть цілу невід’ємну кількість товару.");
        return;
      }
    } else {
      numericStartingPrice = Number(startingPrice);

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

      auctionEndDate = new Date(auctionEndsAt);

      if (
        !Number.isFinite(auctionEndDate.getTime()) ||
        auctionEndDate.getTime() <= Date.now()
      ) {
        setErrorMessage("Аукціон має завершуватися в майбутньому.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const finalImageUrl = imageFile
        ? await uploadProductImage(imageFile)
        : imageUrl.trim();

      if (listingType === "fixed-price") {
        if (currentProduct.listingType !== "fixed-price") {
          return;
        }
        const updatedProduct: FixedPriceProduct = {
          id: currentProduct.id,
          title: trimmedTitle,
          description: description.trim() || null,
          category,
          condition,
          listingType: "fixed-price",
          price: numericPrice!,
          stockQuantity: Number(stockQuantity),
          availableQuantity: currentProduct.availableQuantity,
          imageUrl: finalImageUrl,
          sellerName: currentProduct.sellerName,
          createdAt: currentProduct.createdAt,
        };

        await updateProduct(updatedProduct);
      } else {
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
          description: description.trim() || null,
          category,
          condition,
          listingType: "auction",
          startingPrice: numericStartingPrice!,
          currentBid: currentAuctionData.currentBid,
          bidCount: currentAuctionData.bidCount,
          auctionEndsAt: auctionEndDate!.toISOString(),
          imageUrl: finalImageUrl,
          sellerName: currentProduct.sellerName,
          createdAt: currentProduct.createdAt,
        };

        await updateProduct(updatedProduct);
      }

      navigate("/seller/listings");
    } catch (error) {
      console.error("Failed to update product:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти зміни оголошення.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (isSubmitting || isDeleting) return;

    const confirmed = window.confirm(
      "Ви справді хочете видалити це оголошення? Цю дію неможливо скасувати.",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await removeProduct(currentProduct.id);
      navigate("/seller/listings");
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorMessage("Не вдалося видалити оголошення.");
    } finally {
      setIsDeleting(false);
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
                disabled={isSubmitting || isDeleting}
              />
            </label>

            <label>
              Опис товару
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Опишіть товар, його стан, вік, особливості та дефекти"
                rows={5}
                maxLength={5000}
                disabled={isSubmitting || isDeleting}
              />
            </label>

            <label>
              Категорія
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
              >
                {productConditions.map((item) => (
                  <option key={item} value={item}>
                    {formatCondition(item)}
                  </option>
                ))}
              </select>
            </label>

            <div className="product-image-upload">
              <label htmlFor="edit-product-image">Фотографія товару</label>

              {imagePreview || imageUrl ? (
                <div className="product-image-upload__preview">
                  <img
                    className="product-image-upload__preview-image"
                    src={imagePreview || imageUrl}
                    alt="Фотографія товару"
                  />
                </div>
              ) : null}

              <input
                id="edit-product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isSubmitting || isDeleting}
              />

              <p className="product-image-upload__hint">
                Щоб замінити фото, оберіть новий файл. JPG, PNG або WebP,
                максимум 10 МБ. Якщо нічого не обирати, залишиться поточне фото.
              </p>
            </div>
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
                disabled={isSubmitting || isDeleting}
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
                disabled={isSubmitting || isDeleting}
              />
              {formatListingType("auction")}
            </label>

            {listingType === "fixed-price" ? (
              <>
                <label>
                  Ціна (₴)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    disabled={isSubmitting || isDeleting}
                  />
                </label>
                <label>
                  Кількість товару (шт.)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={(event) => setStockQuantity(event.target.value)}
                    disabled={isSubmitting || isDeleting}
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Початкова ціна (₴)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={startingPrice}
                    onChange={(event) => setStartingPrice(event.target.value)}
                    disabled={isSubmitting || isDeleting}
                  />
                </label>

                <label>
                  Дата й час завершення аукціону
                  <input
                    type="datetime-local"
                    value={auctionEndsAt}
                    onChange={(event) => setAuctionEndsAt(event.target.value)}
                    disabled={isSubmitting || isDeleting}
                  />
                </label>
              </>
            )}
          </section>

          {errorMessage && (
            <p role="alert" className="checkout-summary__error">
              {errorMessage}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="checkout-summary__button"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? "Збереження змін..." : "Зберегти зміни"}
            </button>

            <Link to="/seller/listings" className="empty-state__button">
              Скасувати
            </Link>

            <button
              type="button"
              className="seller-listing__delete"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? "Видалення..." : "Видалити оголошення"}
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
