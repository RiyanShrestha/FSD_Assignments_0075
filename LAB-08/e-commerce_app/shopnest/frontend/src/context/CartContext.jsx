import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shopnest_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      return { success: false, message: 'This item is out of stock' };
    }

    let addedCount = 0;
    let message = '';

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        
        if (newQty > product.stock) {
          addedCount = product.stock - currentQty;
          message = `Only ${product.stock} items are available in stock.`;
          if (addedCount <= 0) {
            return prev;
          }
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], quantity: product.stock };
          return updated;
        }

        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        message = 'Product added to cart';
        return updated;
      }

      const initialQty = Math.min(quantity, product.stock);
      message = 'Product added to cart';
      return [...prev, { product, quantity: initialQty }];
    });

    return { success: true, message };
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    return { success: true, message: 'Product removed from cart' };
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cartItems.find(i => i.product.id === productId);
    if (!item) return { success: false, message: 'Item not found' };

    if (newQuantity === '' || isNaN(newQuantity)) {
      return { success: false, message: 'Please enter a valid number' };
    }

    const parsedQty = parseInt(newQuantity, 10);

    if (parsedQty <= 0) {
      return { success: false, message: 'Quantity must be at least 1' };
    }

    if (parsedQty > item.product.stock) {
      return { 
        success: false, 
        message: `Only ${item.product.stock} items are available in stock.` 
      };
    }

    setCartItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, quantity: parsedQty } : i
    ));

    return { success: true };
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartTotal = () => getSubtotal();

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 2000 ? 0 : 99;
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal + getShipping();
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getSubtotal,
      getShipping,
      getFinalTotal,
      getCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
