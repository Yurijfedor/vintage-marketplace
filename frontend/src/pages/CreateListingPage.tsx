import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../features/products/categories";
import { useProducts } from "../features/products/useProducts";
import { CURRENT_SELLER_NAME } from "../features/seller/currentSeller";
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
      setErrorMessage("Bitte geben Sie einen Titel ein.");
      return;
    }
    if (!category) {
      setErrorMessage("Bitte wählen Sie eine Kategorie.");
      return;
    }
    if (!trimmedImageUrl) {
      setErrorMessage("Bitte geben Sie eine Bild-URL ein.");
      return;
    }
    if (listingType === "fixed-price") {
      const numericPrice = Number(price);
      if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
        setErrorMessage("Bitte geben Sie einen gültigen Preis ein.");
        return;
      }
      const product: Omit<FixedPriceProduct, "id" | "createdAt"> = {
        title: trimmedTitle,
        category,
        condition,
        listingType: "fixed-price",
        price: numericPrice,
        imageUrl: trimmedImageUrl,
        sellerName: CURRENT_SELLER_NAME,
      };

      addProduct(product)
        .then(() => {
          navigate("/seller/listings");
        })
        .catch((error) => {
          console.error("Failed to create product:", error);
          setErrorMessage("Der Artikel konnte nicht erstellt werden.");
        });

      return;
    }
    const numericStartingPrice = Number(startingPrice);
    if (
      !startingPrice ||
      !Number.isFinite(numericStartingPrice) ||
      numericStartingPrice <= 0
    ) {
      setErrorMessage("Bitte geben Sie einen gültigen Startpreis ein.");
      return;
    }
    if (!auctionEndsAt) {
      setErrorMessage("Bitte wählen Sie ein Auktionsende.");
      return;
    }
    const auctionEndDate = new Date(auctionEndsAt);
    if (
      !Number.isFinite(auctionEndDate.getTime()) ||
      auctionEndDate.getTime() <= Date.now()
    ) {
      setErrorMessage("Das Auktionsende muss in der Zukunft liegen.");
      return;
    }
    const product: Omit<AuctionProduct, "id" | "createdAt"> = {
      title: trimmedTitle,
      category,
      condition,
      listingType: "auction",
      startingPrice: numericStartingPrice,
      currentBid: null,
      bidCount: 0,
      auctionEndsAt: auctionEndDate.toISOString(),
      imageUrl: trimmedImageUrl,
      sellerName: CURRENT_SELLER_NAME,
    };

    addProduct(product)
      .then(() => {
        navigate("/seller/listings");
      })
      .catch((error) => {
        console.error("Failed to create product:", error);
        setErrorMessage("Der Artikel konnte nicht erstellt werden.");
      });
  }
  return (
    <section className="checkout-page">
      {" "}
      <div className="checkout-page__header">
        {" "}
        <Link to="/seller/listings" className="product-page__back">
          {" "}
          ← Meine Artikel{" "}
        </Link>{" "}
        <h1>Artikel einstellen</h1>{" "}
        <p>
          {" "}
          Erstellen Sie ein neues Angebot für den Verkauf auf Vintage
          Marketplace.{" "}
        </p>{" "}
      </div>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <div className="checkout-page__content">
          {" "}
          <section className="checkout-card">
            {" "}
            <h2>Artikelinformationen</h2>{" "}
            <label>
              {" "}
              Titel{" "}
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="z. B. Alte Porzellanfigur"
              />{" "}
            </label>{" "}
            <label>
              {" "}
              Kategorie{" "}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {" "}
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {" "}
                    {item}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </label>{" "}
            <label>
              {" "}
              Zustand{" "}
              <select
                value={condition}
                onChange={(event) =>
                  setCondition(event.target.value as ProductCondition)
                }
              >
                {" "}
                {productConditions.map((item) => (
                  <option key={item} value={item}>
                    {" "}
                    {item}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </label>{" "}
            <label>
              {" "}
              Bild-URL{" "}
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
              />{" "}
            </label>{" "}
          </section>{" "}
          <section className="checkout-card">
            {" "}
            <h2>Verkaufsart</h2>{" "}
            <label className="checkout-payment-option">
              {" "}
              <input
                type="radio"
                name="listingType"
                value="fixed-price"
                checked={listingType === "fixed-price"}
                onChange={() => setListingType("fixed-price")}
              />{" "}
              Festpreis{" "}
            </label>{" "}
            <label className="checkout-payment-option">
              {" "}
              <input
                type="radio"
                name="listingType"
                value="auction"
                checked={listingType === "auction"}
                onChange={() => setListingType("auction")}
              />{" "}
              Auktion{" "}
            </label>{" "}
            {listingType === "fixed-price" ? (
              <label>
                {" "}
                Preis (€){" "}
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="29.00"
                />{" "}
              </label>
            ) : (
              <>
                {" "}
                <label>
                  {" "}
                  Startpreis (€){" "}
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={startingPrice}
                    onChange={(event) => setStartingPrice(event.target.value)}
                    placeholder="10.00"
                  />{" "}
                </label>{" "}
                <label>
                  {" "}
                  Auktionsende{" "}
                  <input
                    type="datetime-local"
                    value={auctionEndsAt}
                    onChange={(event) => setAuctionEndsAt(event.target.value)}
                  />{" "}
                </label>{" "}
              </>
            )}{" "}
          </section>{" "}
          {errorMessage && (
            <p className="checkout-summary__error">{errorMessage}</p>
          )}{" "}
          <button type="submit" className="checkout-summary__button">
            {" "}
            Artikel einstellen{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </section>
  );
}
export default CreateListingPage;
