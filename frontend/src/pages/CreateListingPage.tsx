import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { categories } from "../features/products/categories";
import { formatCondition } from "../features/products/productFormatters";
import { useProducts } from "../features/products/useProducts";
import type { ListingType, ProductCondition } from "../types/product";

const productConditions: ProductCondition[] = [
  "new",
  "very-good",
  "good",
  "used",
  "damaged",
];

function CreateListingPage() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [condition, setCondition] = useState<ProductCondition>("good");
  const [listingType, setListingType] = useState<ListingType>("fixed-price");
  const [price, setPrice] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [auctionEndsAt, setAuctionEndsAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      const product = {
        title: trimmedTitle,
        category,
        condition,
        listingType: "fixed-price" as const,
        price: numericPrice,
        imageUrl: trimmedImageUrl,
      };

      addProduct(product)
        .then(() => {
          navigate("/seller/listings");
        })
        .catch((error) => {
          console.error("Failed to create product:", error);
          setErrorMessage("Не вдалося створити оголошення.");
        });

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

    const product = {
      title: trimmedTitle,
      category,
      condition,
      listingType: "auction" as const,
      startingPrice: numericStartingPrice,
      currentBid: null,
      bidCount: 0,
      auctionEndsAt: auctionEndDate.toISOString(),
      imageUrl: trimmedImageUrl,
    };

    addProduct(product)
      .then(() => {
        navigate("/seller/listings");
      })
      .catch((error) => {
        console.error("Failed to create product:", error);
        setErrorMessage("Не вдалося створити оголошення.");
      });
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
                placeholder="https://..."
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
              Фіксована ціна
            </label>

            <label className="checkout-payment-option">
              <input
                type="radio"
                name="listingType"
                value="auction"
                checked={listingType === "auction"}
                onChange={() => setListingType("auction")}
              />
              Аукціон
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
                  placeholder="29.00"
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
                    placeholder="10.00"
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

          <button type="submit" className="checkout-summary__button">
            Опублікувати оголошення
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateListingPage;
