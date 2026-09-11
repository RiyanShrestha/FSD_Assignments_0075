const products = require('../data/products');

const getAllProducts = (req, res) => {
  res.json({ success: true, products });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json({ success: true, product });
};

module.exports = { getAllProducts, getProductById };
