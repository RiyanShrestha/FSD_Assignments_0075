import { parsePrice } from '../data/products.js';

const CART_KEY = 'cart';

export function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
      priceNumber: item.priceNumber || parsePrice(item.price),
    }));
  } catch (err) {
    console.error('Failed to read cart from localStorage', err);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch event so any open listener (Navbar, Cart, etc.) updates synchronously
    window.dispatchEvent(new Event('cartChange'));
  } catch (err) {
    console.error('Failed to save cart to localStorage', err);
  }
}

export function addToCart(product, size, quantity = 1) {
  const cart = getCart();
  const index = cart.findIndex(
    (item) => item.id === product.id && String(item.size) === String(size)
  );

  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumber: product.priceNumber || parsePrice(product.price),
      image: product.image,
      size,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateCartQuantity(id, size, delta) {
  const cart = getCart();
  const index = cart.findIndex(
    (item) => item.id === id && String(item.size) === String(size)
  );

  if (index === -1) return cart;

  const newQty = cart[index].quantity + delta;
  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQty;
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(id, size) {
  const cart = getCart();
  const updated = cart.filter(
    (item) => !(item.id === id && String(item.size) === String(size))
  );
  saveCart(updated);
  return updated;
}

export function clearCart() {
  saveCart([]);
}

export function getCartSubtotal(cart) {
  return cart.reduce((sum, item) => {
    const itemPrice = item.priceNumber || parsePrice(item.price);
    return sum + itemPrice * (item.quantity || 1);
  }, 0);
}

export function getCartCount(cart) {
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
}
