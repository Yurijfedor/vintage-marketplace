import { formatCondition } from "./productFormatters";
import type { ProductCondition } from "../../types/product";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  selectedCondition: ProductCondition | null;
  onCategoryChange: (category: string | null) => void;
  onConditionChange: (condition: ProductCondition | null) => void;
}

const productConditions: ProductCondition[] = [
  "new",
  "very-good",
  "good",
  "used",
  "damaged",
];

function ProductFilters({
  categories,
  selectedCategory,
  selectedCondition,
  onCategoryChange,
  onConditionChange,
}: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <div className="product-filters__group">
        <h2 className="product-filters__title">Категорія</h2>

        <div className="product-filters__options">
          <button
            type="button"
            className={`category-chip ${
              selectedCategory === null ? "category-chip--selected" : ""
            }`}
            onClick={() => onCategoryChange(null)}
          >
            Усі категорії
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                type="button"
                className={`category-chip ${
                  isSelected ? "category-chip--selected" : ""
                }`}
                key={category}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="product-filters__group">
        <h2 className="product-filters__title">Стан товару</h2>

        <div className="product-filters__options">
          <button
            type="button"
            className={`category-chip ${
              selectedCondition === null ? "category-chip--selected" : ""
            }`}
            onClick={() => onConditionChange(null)}
          >
            Будь-який стан
          </button>

          {productConditions.map((condition) => {
            const isSelected = selectedCondition === condition;

            return (
              <button
                type="button"
                className={`category-chip ${
                  isSelected ? "category-chip--selected" : ""
                }`}
                key={condition}
                onClick={() => onConditionChange(condition)}
              >
                {formatCondition(condition)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
