const products = require('../data/products');
const orders = require('../data/orders');

const createOrder = (req, res) => {
  // Use verified user from auth middleware (req.user), not untrusted client body
  const user = req.user;

  if (!user || !user.name || !user.email) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items are required and must be a non-empty array' });
  }

  let total = 0;
  const processedItems = [];

  for (const item of items) {
    const { productId, quantity } = item;
    
    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ success: false, message: `Invalid quantity for product ID ${productId}` });
    }

    const product = products.find(p => p.id === Number(productId));
    
    if (!product) {
      return res.status(404).json({ success: false, message: `Product ID ${productId} not found` });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient stock for ${product.name}. Only ${product.stock} available.` 
      });
    }

    const subtotal = product.price * quantity;
    total += subtotal;
    
    processedItems.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      subtotal,
      image: product.image
    });
  }

  // Calculate dynamic shipping (Free above 2000, otherwise 99)
  const shipping = total >= 2000 ? 0 : 99;
  const finalTotal = total + shipping;

  // Deduct stock only after all items successfully pass validation
  for (const pItem of processedItems) {
    const product = products.find(p => p.id === pItem.productId);
    product.stock -= pItem.quantity;
  }

  const orderId = 'SN-' + Date.now().toString().slice(-6);
  const order = {
    id: orderId,
    customer: {
      name: user.name,
      email: user.email
    },
    items: processedItems,
    subtotal: total,
    shipping,
    total: finalTotal,
    date: new Date().toISOString(),
    status: 'Confirmed'
  };

  orders.unshift(order);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order
  });
};

const getOrders = (req, res) => {
  // If user is authenticated, we can return orders for this user or all orders
  const user = req.user;
  if (user && user.email) {
    const userOrders = orders.filter(o => o.customer && o.customer.email === user.email);
    return res.json({ success: true, orders: userOrders });
  }
  return res.json({ success: true, orders });
};

module.exports = { createOrder, getOrders };
