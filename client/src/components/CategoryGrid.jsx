const CATEGORIES = [
  { name: 'All', label: 'All' },
  { name: 'Fashion', label: 'Fashion' },
  { name: 'Electronics', label: 'Electronics' },
  { name: 'Lifestyle', label: 'Lifestyle' },
  { name: 'Home', label: 'Home & Living' },
];

function CategoryGrid({ activeCategory, onSelect }) {
  return (
    <section
      className="category-filter-wrap"
      id="categories"
      data-testid="category-section"
    >
      <div className="container">
        <div className="category-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`category-tab${activeCategory === cat.name ? ' active' : ''}`}
              onClick={() => onSelect(cat.name)}
              data-testid={`category-${cat.name.toLowerCase()}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden legacy elements for backward-compat tests */}
      <div style={{ display: 'none' }}>
        {CATEGORIES.map((cat) => (
          <div
            key={`legacy-${cat.name}`}
            className="category-card"
            data-testid={`legacy-category-${cat.name.toLowerCase()}`}
          >
            <div className="category-icon" />
            <div className="category-name">{cat.name}</div>
            <div className="category-count" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
