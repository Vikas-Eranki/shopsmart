const CATEGORIES = [
  { name: 'All', icon: '🛍️', count: 20 },
  { name: 'Electronics', icon: '⚡', count: 5 },
  { name: 'Fashion', icon: '👗', count: 5 },
  { name: 'Lifestyle', icon: '🌿', count: 5 },
  { name: 'Home', icon: '🏠', count: 5 },
];

function CategoryGrid({ activeCategory, onSelect }) {
  return (
    <section className="section-gap-sm" id="categories" data-testid="category-section">
      <div className="container">
        <div className="section-label">Browse by Category</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-sub" style={{ marginTop: 0, textAlign: 'right' }}>
            {CATEGORIES.length - 1} categories · 20 products
          </p>
        </div>

        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`category-card${activeCategory === cat.name ? ' active' : ''}`}
              onClick={() => onSelect(cat.name)}
              data-testid={`category-${cat.name.toLowerCase()}`}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} items</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
