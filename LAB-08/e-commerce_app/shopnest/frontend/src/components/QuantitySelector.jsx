const QuantitySelector = ({ quantity, maxStock, onChange, disabled = false }) => {
  const handleMinus = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };
  
  const handlePlus = () => {
    if (quantity < maxStock && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleChange = (e) => {
    if (disabled) return;
    const val = e.target.value;
    if (val === '') {
      onChange(1);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1) onChange(1);
      else if (num > maxStock) onChange(maxStock);
      else onChange(num);
    }
  };

  return (
    <div className="quantity-selector-wrapper">
      <div className="qty-controls">
        <button 
          type="button"
          className="qty-btn"
          onClick={handleMinus} 
          disabled={quantity <= 1 || disabled}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input 
          type="number" 
          className="qty-input"
          value={quantity} 
          onChange={handleChange}
          min="1"
          max={maxStock}
          disabled={disabled}
          aria-label="Product quantity"
        />
        <button 
          type="button"
          className="qty-btn"
          onClick={handlePlus} 
          disabled={quantity >= maxStock || disabled}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      {quantity >= maxStock && maxStock > 0 && (
        <span className="stock-warning">⚠ Max available stock reached ({maxStock})</span>
      )}
    </div>
  );
};

export default QuantitySelector;
