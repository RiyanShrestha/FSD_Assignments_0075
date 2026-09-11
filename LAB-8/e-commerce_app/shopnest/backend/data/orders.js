const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'orders.json');

let orders = [];

try {
  if (fs.existsSync(jsonPath)) {
    const data = fs.readFileSync(jsonPath, 'utf-8');
    orders = JSON.parse(data);
  }
} catch (e) {
  console.error('Error reading orders.json:', e);
}

const saveOrders = async () => {
  try {
    await fs.promises.writeFile(jsonPath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save orders to JSON:', e);
  }
};

module.exports = orders;
module.exports.saveOrders = saveOrders;
