import { formatPrice } from '../utils/formatters';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const getBadgeClass = (badge) => {
    if (!badge) return 'badge-accent';
    const map = {
      'Best Seller': 'badge-accent',
      Hot: 'badge-danger',
      New: 'badge-success',
      Sale: 'badge-warning',
    };
    return map[badge] || 'badge-accent';
  };

  return (
    <div className="product-card" data-testid="product-card">
      <div className="product-image-wrap">
        <img
          src={
            product.image ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'
          }
          alt={product.name}
          className="product-image"
          data-testid="product-image"
          loading="lazy"
        />
        {product.badge && (
          <div className="product-badge">
            <span className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
          </div>
        )}
        <button className="product-wishlist" aria-label="Add to wishlist">
          ♡
        </button>
        <button
          className="product-quick-add"
          onClick={() => onAddToCart && onAddToCart(product)}
          data-testid="quick-add-btn"
        >
          + Quick Add
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name" data-testid="product-name">
          {product.name}
        </h3>

        <div className="product-rating">
          <Stars rating={product.rating || 4} />
          <span className="rating-count">({product.reviews || 0})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price" data-testid="product-price">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
          )}
          {discount > 0 && <span className="product-discount">{discount}% off</span>}
        </div>

        <button
          className="add-to-cart-btn"
          data-testid="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
