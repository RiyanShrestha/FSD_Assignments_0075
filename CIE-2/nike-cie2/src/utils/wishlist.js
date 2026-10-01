const WISHLIST_KEY = 'wishlist';

export function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read wishlist from localStorage', err);
    return [];
  }
}

export function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wishlistChange'));
  } catch (err) {
    console.error('Failed to save wishlist to localStorage', err);
  }
}

export function isInWishlist(productId) {
  const items = getWishlist();
  return items.some((item) => item.id === productId);
}

export function toggleWishlist(product) {
  const items = getWishlist();
  const exists = items.some((item) => item.id === product.id);
  let updated;

  if (exists) {
    updated = items.filter((item) => item.id !== product.id);
  } else {
    updated = [
      ...items,
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
      },
    ];
  }

  saveWishlist(updated);
  return { updated, added: !exists };
}

export function removeFromWishlist(productId) {
  const items = getWishlist();
  const updated = items.filter((item) => item.id !== productId);
  saveWishlist(updated);
  return updated;
}

export function getWishlistCount() {
  return getWishlist().length;
}
