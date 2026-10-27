import { useEffect, useState, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { categories } from "../features/products/categories";
import { formatCondition } from "../features/products/productFormatters";
import { useProducts } from "../features/products/useProducts";
import { uploadProductImage } from "../api/uploadsApi";
import type { ListingType, ProductCondition } from "../types/product";

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

function CreateListingPage() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [condition, setCondition] = useState<ProductCondition>("good");
  const [listingType, setListingType] = useState<ListingType>("fixed-price");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [startingPrice, setStartingPrice] = useState("");
  const [auctionEndsAt, setAuctionEndsAt] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setImageUrl("");

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

    if (isSubmitting) return;

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

    if (!imageFile) {
      setErrorMessage("Оберіть фотографію товару.");
      return;
    }

    let numericPrice: number | undefined;
    let numericStartingPrice: number | undefined;
    let numericStockQuantity: number | undefined;
    let auctionEndDate: Date | undefined;

    if (listingType === "fixed-price") {
      numericStockQuantity = Number(stockQuantity);

      if (
        !stockQuantity ||
        !Number.isInteger(numericStockQuantity) ||
        numericStockQuantity < 1 ||
        numericStockQuantity > 9999
      ) {
        setErrorMessage("Кількість має бути цілим числом від 1 до 9999.");
        return;
      }

      numericPrice = Number(price);

      if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
        setErrorMessage("Введіть коректну ціну.");
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
      const uploadedImageUrl = await uploadProductImage(imageFile);
      setImageUrl(uploadedImageUrl);

      if (listingType === "fixed-price") {
        await addProduct({
          title: trimmedTitle,
          description: description.trim() || null,
          category,
          condition,
          listingType: "fixed-price",
          price: numericPrice!,
          stockQuantity: numericStockQuantity!,
          availableQuantity: numericStockQuantity!,
          imageUrl: uploadedImageUrl,
        });
      } else {
        await addProduct({
          title: trimmedTitle,
          description: description.trim() || null,
          category,
          condition,
          listingType: "auction",
          startingPrice: numericStartingPrice!,
          currentBid: null,
          bidCount: 0,
          auctionEndsAt: auctionEndDate!.toISOString(),
          imageUrl: uploadedImageUrl,
        });
      }

      navigate("/seller/listings");
    } catch (error) {
      console.error("Failed to upload image or create product:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити фото або створити оголошення.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-page__header">
        <Link to="/seller/listings" className="product-page__back">
          ← Мої оголошення
        </Link>

        <h1>Створити оголошення</h1>

        <p>
          Заповніть інформацію про товар, щоб виставити його на продаж у
          «Вінтажній крамничці».
        </p>
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
                placeholder="Наприклад, стара порцелянова фігурка"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </label>

            <label>
              Категорія
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {productConditions.map((item) => (
                  <option key={item} value={item}>
                    {formatCondition(item)}
                  </option>
                ))}
              </select>
            </label>

            <div className="product-image-upload">
              <label htmlFor="product-image">Фотографія товару</label>

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />

              <p className="product-image-upload__hint">
                JPG, PNG або WebP. Максимальний розмір — 10 МБ.
              </p>

              {imagePreview && (
                <div className="product-image-upload__preview">
                  <img
                    src={imagePreview}
                    alt="Попередній перегляд фотографії товару"
                  />
                  <p>{imageFile?.name}</p>
                </div>
              )}

              {imageUrl && (
                <p className="product-image-upload__success">
                  Фотографію завантажено.
                </p>
              )}
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
                disabled={isSubmitting}
              />
              Фіксована ціна
            </label>

            <label className="checkout-payment-option">
              <input
                type="radio"
                name="listingType"
                value="auction"
                checked={listingType === "auction"}
                onChange={() => setListingType("auction")}
                disabled={isSubmitting}
              />
              Аукціон
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
                    placeholder="29.00"
                    disabled={isSubmitting}
                  />
                </label>
                <label>
                  Кількість товару
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    step={1}
                    value={stockQuantity}
                    onChange={(event) => setStockQuantity(event.target.value)}
                    disabled={isSubmitting}
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
                    placeholder="10.00"
                    disabled={isSubmitting}
                  />
                </label>

                <label>
                  Дата й час завершення аукціону
                  <input
                    type="datetime-local"
                    value={auctionEndsAt}
                    onChange={(event) => setAuctionEndsAt(event.target.value)}
                    disabled={isSubmitting}
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

          <button
            type="submit"
            className="checkout-summary__button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Завантаження фото та публікація..."
              : "Опублікувати оголошення"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateListingPage;
