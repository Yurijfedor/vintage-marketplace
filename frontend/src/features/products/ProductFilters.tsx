interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <button
        type="button"
        className={`category-chip ${
          selectedCategory === null ? "category-chip--selected" : ""
        }`}
        onClick={() => onCategoryChange(null)}
      >
        Alle
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
  );
}

export default ProductFilters;
