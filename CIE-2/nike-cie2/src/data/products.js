export const products = [
  {
    id: 'air-max-dn8',
    name: 'Air Max Dn8',
    category: "Men's Shoes",
    gender: 'men',
    price: '₹14,995',
    priceNumber: 14995,
    description:
      'Featuring a dynamic Air unit system, delivering a responsive feel with every step. Built for all-day comfort and street-ready style.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'air-force-style',
    name: 'Air Force Style',
    category: "Women's Shoes",
    gender: 'women',
    price: '₹11,495',
    priceNumber: 11495,
    description:
      'Iconic street style with all-day cushioning and crisp leather edges. An effortless classic that pairs with anything.',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'runner-pro',
    name: 'Runner Pro',
    category: "Women's Shoes",
    gender: 'women',
    price: '₹13,995',
    priceNumber: 13995,
    description:
      'A comfortable running shoe engineered for active everyday use and high-mileage runs with responsive foam cushioning.',
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: 'court-vision',
    name: 'Court Vision',
    category: "Women's Shoes",
    gender: 'women',
    price: '₹10,995',
    priceNumber: 10995,
    description:
      'A clean court-inspired design made for everyday comfort, inspired by mid-80s basketball sneaker culture.',
    image:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: 'air-motion-runner',
    name: 'Air Motion Runner',
    category: "Men's Shoes",
    gender: 'men',
    price: '₹12,995',
    priceNumber: 12995,
    description:
      'A lightweight running shoe designed for everyday movement, comfort and performance.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
  {
    id: 'street-court',
    name: 'Street Court',
    category: "Men's Shoes",
    gender: 'men',
    price: '₹10,495',
    priceNumber: 10495,
    description:
      'A classic court-inspired shoe with a comfortable design for everyday wear.',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
  {
    id: 'everyday-trainer',
    name: 'Everyday Trainer',
    category: "Men's Shoes",
    gender: 'men',
    price: '₹11,995',
    priceNumber: 11995,
    description:
      'A versatile trainer made for daily workouts and casual movement.',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
  {
    id: 'performance-runner',
    name: 'Performance Runner',
    category: "Men's Shoes",
    gender: 'men',
    price: '₹13,995',
    priceNumber: 13995,
    description:
      'A performance-focused running shoe built for comfortable movement.',
    image:
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
  {
    id: 'air-motion',
    name: 'Air Motion',
    category: "Women's Shoes",
    gender: 'women',
    price: '₹11,995',
    priceNumber: 11995,
    description:
      'A lightweight everyday shoe combining comfort and modern style.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
  {
    id: 'everyday-move',
    name: 'Everyday Move',
    category: "Women's Shoes",
    gender: 'women',
    price: '₹12,495',
    priceNumber: 12495,
    description:
      'A versatile sneaker designed for movement and everyday style.',
    image:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
  },
];

export const productsMap = products.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

export function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
}

export function getProductById(id) {
  return productsMap[id] || null;
}
