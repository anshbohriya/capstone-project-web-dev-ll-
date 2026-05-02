const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'shopnest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Static files
app.use(express.static('.'));

// Sample data
const PRODUCTS = [
  { id: 1, name: 'Wireless Bluetooth Headphones', cat: 'electronics', emoji: '🎧', price: 89.99, rating: 4.5, reviews: 1247, badge: 'bestseller' },
  { id: 2, name: 'Smart Fitness Watch', cat: 'electronics', emoji: '⌚', price: 199.99, rating: 4.3, reviews: 892, badge: 'new' },
  { id: 3, name: 'Organic Cotton T-Shirt', cat: 'clothing', emoji: '👕', price: 24.99, rating: 4.2, reviews: 567 },
  { id: 4, name: 'Stainless Steel Water Bottle', cat: 'home', emoji: '🍼', price: 19.99, rating: 4.7, reviews: 2341 },
  { id: 5, name: 'Yoga Mat Premium', cat: 'sports', emoji: '🧘', price: 49.99, rating: 4.4, reviews: 678, badge: 'featured' },
  { id: 6, name: 'Ceramic Coffee Mug Set', cat: 'home', emoji: '☕', price: 34.99, rating: 4.1, reviews: 345 },
  { id: 7, name: 'Running Shoes', cat: 'sports', emoji: '👟', price: 129.99, rating: 4.6, reviews: 2156 },
  { id: 8, name: 'Leather Wallet', cat: 'accessories', emoji: '👛', price: 39.99, rating: 4.0, reviews: 789 },
  { id: 9, name: 'LED Desk Lamp', cat: 'home', emoji: '💡', price: 59.99, rating: 4.3, reviews: 456, badge: 'sale' },
  { id: 10, name: 'Wireless Mouse', cat: 'electronics', emoji: '🖱️', price: 29.99, rating: 4.2, reviews: 1234 },
  { id: 11, name: 'Denim Jeans', cat: 'clothing', emoji: '👖', price: 79.99, rating: 4.1, reviews: 987 },
  { id: 12, name: 'Plant Pot Set', cat: 'home', emoji: '🪴', price: 44.99, rating: 4.4, reviews: 321 },
  { id: 13, name: 'Basketball', cat: 'sports', emoji: '🏀', price: 34.99, rating: 4.5, reviews: 654 },
  { id: 14, name: 'Sunglasses', cat: 'accessories', emoji: '🕶️', price: 69.99, rating: 4.3, reviews: 876 },
  { id: 15, name: 'Notebook Set', cat: 'stationery', emoji: '📓', price: 14.99, rating: 4.0, reviews: 543 },
  { id: 16, name: 'Backpack', cat: 'accessories', emoji: '🎒', price: 89.99, rating: 4.4, reviews: 1098 },
  { id: 17, name: 'Essential Oil Diffuser', cat: 'home', emoji: '🕯️', price: 39.99, rating: 4.2, reviews: 432 },
  { id: 18, name: 'Protein Powder', cat: 'sports', emoji: '💪', price: 49.99, rating: 4.1, reviews: 765 },
  { id: 19, name: 'Wireless Earbuds', cat: 'electronics', emoji: '🎵', price: 149.99, rating: 4.6, reviews: 1876 },
  { id: 20, name: 'Throw Blanket', cat: 'home', emoji: '🛋️', price: 54.99, rating: 4.3, reviews: 654 }
];

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'home', label: 'Home & Garden', icon: '🏠' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'accessories', label: 'Accessories', icon: '👜' },
  { id: 'stationery', label: 'Stationery', icon: '✏️' }
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.get('/api/categories', (req, res) => {
  const counts = {};
  PRODUCTS.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  res.json(CATEGORIES.map(c => ({ ...c, count: counts[c.id] || 0 })));
});

// Cart routes
app.get('/api/cart', (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  res.json(req.session.cart);
});

app.post('/api/cart', (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = req.session.cart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    req.session.cart.push({ product, qty });
  }

  res.json(req.session.cart);
});

app.patch('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const item = req.session.cart.find(c => c.product.id === parseInt(productId));
  if (!item) return res.status(404).json({ error: 'Item not found in cart' });

  item.qty = Math.max(1, qty);
  res.json(req.session.cart);
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  if (!req.session.cart) req.session.cart = [];

  req.session.cart = req.session.cart.filter(c => c.product.id !== parseInt(productId));
  res.json(req.session.cart);
});

app.delete('/api/cart', (req, res) => {
  req.session.cart = [];
  res.json([]);
});

// Wishlist routes
app.get('/api/wishlist', (req, res) => {
  if (!req.session.wishlist) req.session.wishlist = [];
  res.json(req.session.wishlist);
});

app.post('/api/wishlist/:productId', (req, res) => {
  const { productId } = req.params;
  if (!req.session.wishlist) req.session.wishlist = [];

  const index = req.session.wishlist.indexOf(parseInt(productId));
  if (index === -1) {
    req.session.wishlist.push(parseInt(productId));
  } else {
    req.session.wishlist.splice(index, 1);
  }

  res.json(req.session.wishlist);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
