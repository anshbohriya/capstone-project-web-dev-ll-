/**
 * ShopNest — App.jsx
 * Full React E-Commerce Application
 *
 * Features:
 *  - Home page with hero, categories, featured products
 *  - Shop page with filters sidebar, search, sort, grid/list view
 *  - Product detail page with gallery, qty, color/size picker
 *  - Cart page with quantity controls and order summary
 *  - Checkout flow (3-step: Shipping → Payment → Review)
 *  - Wishlist page
 *  - Order success page
 *  - Toast notifications
 *
 * Install:  npm install react react-dom
 * Run:      npx vite  (or create-react-app)
 */

import { useState, useCallback, useEffect, useRef } from "react";

/* ─────────────────── DATA ─────────────────── */
const CATEGORIES = [
  { id: "electronics", label: "Electronics",    icon: "💻" },
  { id: "fashion",     label: "Fashion",         icon: "👗" },
  { id: "home",        label: "Home & Living",   icon: "🏠" },
  { id: "sports",      label: "Sports",          icon: "⚽" },
  { id: "beauty",      label: "Beauty",          icon: "💄" },
  { id: "books",       label: "Books",           icon: "📚" },
  { id: "toys",        label: "Toys",            icon: "🎮" },
  { id: "food",        label: "Food & Grocery",  icon: "🛒" },
];

const PRODUCTS = [
  { id:1,  name:'Ultra 4K Smart TV 55"',             cat:'electronics', price:799,  oldPrice:1099, rating:4.8, reviews:2341, emoji:'📺', badge:'hot',  inStock:true,  desc:'Crystal-clear 4K display with Dolby Vision. Built-in streaming and voice assistant.' },
  { id:2,  name:'Wireless Noise-Cancelling Headphones', cat:'electronics', price:299, oldPrice:449, rating:4.9, reviews:5678, emoji:'🎧', badge:'sale', inStock:true,  desc:'Industry-leading ANC with 30-hour battery. Premium audio.' },
  { id:3,  name:'iPhone 15 Pro Max 256GB',            cat:'electronics', price:1199, oldPrice:null, rating:4.9, reviews:9823, emoji:'📱', badge:'new',  inStock:true,  desc:'A17 Pro chip, titanium design, 5x optical zoom camera.' },
  { id:4,  name:'Mechanical Gaming Keyboard',         cat:'electronics', price:149, oldPrice:199,  rating:4.7, reviews:1432, emoji:'⌨️', badge:null,   inStock:true,  desc:'RGB per-key lighting, Cherry MX switches, N-key rollover.' },
  { id:5,  name:'Designer Leather Jacket',            cat:'fashion',     price:349, oldPrice:549,  rating:4.6, reviews:876,  emoji:'🧥', badge:'sale', inStock:true,  desc:'Premium full-grain leather crafted in Italy.' },
  { id:6,  name:'Running Sneakers Pro',               cat:'fashion',     price:129, oldPrice:179,  rating:4.5, reviews:3421, emoji:'👟', badge:null,   inStock:true,  desc:'Lightweight mesh upper with responsive foam midsole.' },
  { id:7,  name:'Luxury Silk Dress',                  cat:'fashion',     price:229, oldPrice:null, rating:4.8, reviews:542,  emoji:'👗', badge:'new',  inStock:false, desc:'Pure silk fabric with hand-finished seams.' },
  { id:8,  name:'Minimalist Watch',                   cat:'fashion',     price:189, oldPrice:249,  rating:4.7, reviews:1876, emoji:'⌚', badge:null,   inStock:true,  desc:'Swiss movement, sapphire crystal, slim 8mm profile.' },
  { id:9,  name:'Ergonomic Office Chair',             cat:'home',        price:459, oldPrice:649,  rating:4.7, reviews:2109, emoji:'🪑', badge:'hot',  inStock:true,  desc:'Lumbar support, adjustable armrests, breathable mesh.' },
  { id:10, name:'Air Purifier HEPA H13',              cat:'home',        price:219, oldPrice:299,  rating:4.8, reviews:3201, emoji:'💨', badge:null,   inStock:true,  desc:'True HEPA H13, covers 1500 sq ft with air quality monitor.' },
  { id:11, name:'Espresso Coffee Machine',            cat:'home',        price:399, oldPrice:549,  rating:4.9, reviews:1567, emoji:'☕', badge:'hot',  inStock:true,  desc:'15-bar pressure, built-in grinder and milk frother.' },
  { id:12, name:'Smart Robot Vacuum',                 cat:'home',        price:549, oldPrice:749,  rating:4.6, reviews:892,  emoji:'🤖', badge:'new',  inStock:true,  desc:'LiDAR navigation, self-emptying base, mops & vacuums.' },
  { id:13, name:'Yoga Mat Premium 6mm',               cat:'sports',      price:79,  oldPrice:109,  rating:4.7, reviews:4321, emoji:'🧘', badge:null,   inStock:true,  desc:'Extra-thick eco-friendly TPE, non-slip both sides.' },
  { id:14, name:'Adjustable Dumbbell Set',            cat:'sports',      price:289, oldPrice:399,  rating:4.8, reviews:2134, emoji:'🏋️', badge:'sale', inStock:true,  desc:'Replaces 15 pairs, 5–52.5 lbs, quick-adjust dial.' },
  { id:15, name:'Mountain Bike 27-Speed',             cat:'sports',      price:679, oldPrice:899,  rating:4.6, reviews:678,  emoji:'🚴', badge:null,   inStock:true,  desc:'Aluminum alloy frame with hydraulic disc brakes.' },
  { id:16, name:'Luxury Skincare Set',                cat:'beauty',      price:159, oldPrice:219,  rating:4.9, reviews:3456, emoji:'✨', badge:'hot',  inStock:true,  desc:'5-step routine with vitamin C serum and SPF 50.' },
  { id:17, name:'Electric Toothbrush',                cat:'beauty',      price:89,  oldPrice:129,  rating:4.8, reviews:5678, emoji:'🪥', badge:null,   inStock:true,  desc:'5 cleaning modes, pressure sensor, 3-week battery.' },
  { id:18, name:'Perfume Collection Set',             cat:'beauty',      price:199, oldPrice:null, rating:4.7, reviews:1234, emoji:'🌸', badge:'new',  inStock:true,  desc:'5 luxury fragrances in a premium gift box.' },
  { id:19, name:'JavaScript: The Good Parts',         cat:'books',       price:29,  oldPrice:45,   rating:4.8, reviews:8932, emoji:'📖', badge:null,   inStock:true,  desc:'Douglas Crockford\'s essential guide for developers.' },
  { id:20, name:'System Design Interview',            cat:'books',       price:39,  oldPrice:null, rating:4.9, reviews:6543, emoji:'📕', badge:'hot',  inStock:true,  desc:'Step-by-step frameworks for system design interviews.' },
  { id:21, name:'Gaming Console Bundle',              cat:'toys',        price:599, oldPrice:699,  rating:4.9, reviews:7654, emoji:'🎮', badge:'hot',  inStock:true,  desc:'2 controllers, 3 exclusive titles, 1TB SSD.' },
  { id:22, name:'LEGO Technic Set 1500pcs',           cat:'toys',        price:149, oldPrice:199,  rating:4.8, reviews:2345, emoji:'🧱', badge:null,   inStock:true,  desc:'Working V8 engine mechanism. Ages 10+.' },
  { id:23, name:'Organic Coffee Beans 1kg',           cat:'food',        price:24,  oldPrice:34,   rating:4.8, reviews:9876, emoji:'☕', badge:'sale', inStock:true,  desc:'Ethiopian Yirgacheffe light roast, blueberry notes.' },
  { id:24, name:'Protein Powder Chocolate',           cat:'food',        price:59,  oldPrice:79,   rating:4.7, reviews:4567, emoji:'🍫', badge:null,   inStock:true,  desc:'25g protein per serving, whey isolate, 60 servings.' },
];

const PROMO_CODES = {
  SAVE20: { type: "percent", value: 0.2,  label: "20% off" },
  FLAT50: { type: "flat",    value: 50,   label: "$50 off" },
};

/* ─────────────────── HOOKS ─────────────────── */
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const timerRef = useRef(null);
  const showToast = useCallback((msg) => {
    clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);
  return [toast, showToast];
}

function useCart() {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(c => c.product.id === product.id);
      if (ex) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setCart(p => p.filter(c => c.product.id !== id)), []);

  const updateQty = useCallback((id, delta) =>
    setCart(p => p.map(c => c.product.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)), []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal  = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal   = cart.reduce((s, c) => s + c.product.price * c.qty, 0);

  return { cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, subtotal };
}

function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const toggle = useCallback((id) =>
    setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const has = (id) => wishlist.includes(id);
  return { wishlist, toggle, has };
}

/* ─────────────────── SMALL COMPONENTS ─────────────────── */
const Stars = ({ rating }) => {
  const full = Math.round(rating);
  return <span style={{ color: "#fbbf24", letterSpacing: "2px" }}>
    {"★".repeat(full)}{"☆".repeat(5 - full)}
  </span>;
};

const Badge = ({ type }) => {
  if (!type) return null;
  const colors = { hot: "#f97316", sale: "#ef4444", new: "#3b82f6" };
  return <span style={{
    background: colors[type], color: "#fff",
    padding: "2px 8px", borderRadius: "4px",
    fontSize: "10px", fontWeight: 700,
    fontFamily: "'Sora', sans-serif",
  }}>{type.toUpperCase()}</span>;
};

const Toast = ({ toast }) => (
  <div style={{
    position: "fixed", bottom: 28, right: 28,
    background: "#1a1d2e", border: "1px solid #2a2d42",
    borderLeft: "4px solid #f97316",
    padding: "14px 22px", borderRadius: "8px",
    fontSize: 14, color: "#e8eaf0",
    boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
    transform: toast.show ? "translateY(0)" : "translateY(80px)",
    opacity: toast.show ? 1 : 0,
    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 9999,
  }}>{toast.msg}</div>
);

/* ─────────────────── PRODUCT CARD ─────────────────── */
const ProductCard = ({ product: p, onOpen, onAddToCart, wishlist, onToggleWish }) => {
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const savePct = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const isWished = wishlist.has(p.id);

  return (
    <div onClick={() => onOpen(p)} style={{
      background: "#1a1d2e", border: "1px solid #2a2d42",
      borderRadius: 14, overflow: "hidden",
      cursor: "pointer", transition: "all 0.25s",
      position: "relative",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "#2a2d42";
        e.currentTarget.style.boxShadow = "";
      }}>
      {/* Image */}
      <div style={{
        height: 190, background: "#13151f",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 64, position: "relative",
      }}>
        {p.badge && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge type={p.badge} />
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onToggleWish(p.id); }}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: isWished ? "rgba(239,68,68,0.2)" : "rgba(13,14,20,0.7)",
            border: `1px solid ${isWished ? "#ef4444" : "#2a2d42"}`,
            fontSize: 15, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
          {isWished ? "❤️" : "♡"}
        </button>
        {p.emoji}
      </div>
      {/* Body */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{p.cat}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{p.name}</div>
        <div>
          <Stars rating={p.rating} />
          <span style={{ fontSize: 11, color: "#8b90a8", marginLeft: 5 }}>({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ margin: "10px 0", display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>${p.price}</span>
          {hasDiscount && <>
            <span style={{ fontSize: 13, color: "#555a7a", textDecoration: "line-through" }}>${p.oldPrice}</span>
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>-{savePct}%</span>
          </>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(p); }}
            style={{
              flex: 1, padding: "9px", borderRadius: 8,
              background: "#f97316", color: "#fff",
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              border: "none", fontFamily: "'Sora',sans-serif",
              transition: "background 0.2s",
            }}>Add to Cart</button>
          <button
            onClick={e => { e.stopPropagation(); onOpen(p); }}
            style={{
              padding: "9px 12px", borderRadius: 8,
              border: "1.5px solid #2a2d42", background: "none",
              color: "#8b90a8", fontSize: 12, cursor: "pointer",
              transition: "all 0.2s",
            }}>👁</button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── PAGES ─────────────────── */

// ── HOME ──
const HomePage = ({ onNavigate, onOpenProduct, onAddToCart, wishlist, onToggleWish, showToast }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <div style={{
        padding: "80px 40px",
        background: "linear-gradient(135deg,#0d0e14 0%,#1a1024 50%,#0d1428 100%)",
        borderBottom: "1px solid #2a2d42",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "rgba(249,115,22,0.18)",
            color: "#f97316", border: "1px solid rgba(249,115,22,0.3)",
            padding: "3px 12px", borderRadius: 30, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.5px", marginBottom: 20, fontFamily: "'Sora',sans-serif",
          }}>🔥 New Season Arrivals</span>
          <h1 style={{
            fontFamily: "'Sora',sans-serif", fontSize: "clamp(36px,5vw,56px)",
            fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 20,
          }}>
            Discover <span style={{ color: "#f97316" }}>Premium</span>{" "}
            Products at Your Fingertips
          </h1>
          <p style={{ fontSize: 16, color: "#8b90a8", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Explore thousands of curated products across every category. Fast delivery, hassle-free returns.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("shop")} style={{
              padding: "14px 32px", borderRadius: 40, background: "#f97316",
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
              border: "none", fontFamily: "'Sora',sans-serif",
              boxShadow: "0 0 30px rgba(249,115,22,0.3)",
            }}>Shop Now →</button>
            <button onClick={() => onNavigate("wishlist")} style={{
              padding: "14px 32px", borderRadius: 40, background: "none",
              border: "1.5px solid #2a2d42", color: "#e8eaf0",
              fontWeight: 600, fontSize: 15, cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}>View Wishlist</button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
            {[["50K+","Products"],["2M+","Customers"],["4.9★","Rating"],["24/7","Support"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#8b90a8", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "60px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>Shop by Category</h2>
        <p style={{ color: "#8b90a8", fontSize: 14, marginBottom: 24 }}>Browse our curated collections</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => { setActiveCategory(null); onNavigate("shop"); }}
            style={{
              padding: "10px 22px", borderRadius: 40,
              background: activeCategory === null ? "rgba(249,115,22,0.18)" : "#1a1d2e",
              border: `1.5px solid ${activeCategory === null ? "#f97316" : "#2a2d42"}`,
              color: activeCategory === null ? "#f97316" : "#8b90a8",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>🌐 All</button>
          {CATEGORIES.map(c => (
            <button key={c.id}
              onClick={() => { setActiveCategory(c.id); onNavigate("shop", c.id); }}
              style={{
                padding: "10px 22px", borderRadius: 40,
                background: activeCategory === c.id ? "rgba(249,115,22,0.18)" : "#1a1d2e",
                border: `1.5px solid ${activeCategory === c.id ? "#f97316" : "#2a2d42"}`,
                color: activeCategory === c.id ? "#f97316" : "#8b90a8",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s",
              }}>{c.icon} {c.label}</button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: "0 40px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>Featured Products</h2>
            <p style={{ color: "#8b90a8", fontSize: 14 }}>Handpicked deals you'll love</p>
          </div>
          <button onClick={() => onNavigate("shop")} style={{
            padding: "10px 24px", borderRadius: 40, background: "none",
            border: "1.5px solid #2a2d42", color: "#e8eaf0",
            fontSize: 13, cursor: "pointer",
          }}>View All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p}
              onOpen={onOpenProduct} onAddToCart={prod => { onAddToCart(prod); showToast(`🛍️ "${prod.name}" added to cart!`); }}
              wishlist={wishlist} onToggleWish={id => { onToggleWish(id); showToast(wishlist.has(id) ? "💔 Removed from wishlist" : "❤️ Added to wishlist!"); }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ── SHOP ──
const ShopPage = ({ initCat, onOpenProduct, onAddToCart, wishlist, onToggleWish, showToast }) => {
  const [search, setSearch]     = useState("");
  const [cats, setCats]         = useState(initCat ? [initCat] : []);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [onSale, setOnSale]     = useState(false);
  const [sort, setSort]         = useState("default");
  const [view, setView]         = useState("grid");

  const products = PRODUCTS
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()))
    .filter(p => cats.length === 0 || cats.includes(p.cat))
    .filter(p => p.price <= maxPrice)
    .filter(p => p.rating >= minRating)
    .filter(p => !onSale || (p.oldPrice && p.oldPrice > p.price));

  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc")  return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "rating")     return b.rating - a.rating;
    if (sort === "newest")     return b.id - a.id;
    return 0;
  });

  const toggleCat = (id) =>
    setCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]);

  const S = { label: { fontSize: 12, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: 12 } };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, padding: "40px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Sidebar */}
      <aside style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 24, height: "fit-content", position: "sticky", top: 88 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700 }}>Filters</h3>
          <button onClick={() => { setCats([]); setMaxPrice(2000); setMinRating(0); setOnSale(false); setSearch(""); }}
            style={{ fontSize: 11, color: "#f97316", fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}>Clear All</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>Price Range</label>
          <input type="range" min="0" max="2000" value={maxPrice}
            onChange={e => setMaxPrice(+e.target.value)}
            style={{ width: "100%", accentColor: "#f97316" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8b90a8" }}>
            <span>$0</span><span>Up to <b style={{ color: "#f97316" }}>${maxPrice}</b></span>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>Category</label>
          {CATEGORIES.map(c => (
            <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#8b90a8", cursor: "pointer", marginBottom: 10 }}>
              <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggleCat(c.id)}
                style={{ accentColor: "#f97316", width: 16, height: 16 }} />
              {c.icon} {c.label}
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#555a7a" }}>
                {PRODUCTS.filter(p => p.cat === c.id).length}
              </span>
            </label>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>Min Rating</label>
          {[4, 3, 2].map(r => (
            <div key={r} onClick={() => setMinRating(minRating === r ? 0 : r)}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 0",
                color: minRating === r ? "#f97316" : "#8b90a8" }}>
              <Stars rating={r} /><span style={{ fontSize: 12 }}>& up</span>
            </div>
          ))}
        </div>

        <div>
          <label style={{ ...S.label, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={onSale} onChange={e => setOnSale(e.target.checked)} style={{ accentColor: "#f97316" }} />
            On Sale Only
          </label>
        </div>
      </aside>

      {/* Products */}
      <main>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, minWidth: 200, padding: "10px 16px", background: "#1a1d2e", border: "1.5px solid #2a2d42", borderRadius: 40, color: "#e8eaf0", fontSize: 14 }} />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#8b90a8" }}>
              <b style={{ color: "#e8eaf0" }}>{sorted.length}</b> products
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: "8px 14px", background: "#1a1d2e", border: "1.5px solid #2a2d42", borderRadius: 8, color: "#e8eaf0", fontSize: 13, cursor: "pointer" }}>
              <option value="default">Sort: Featured</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            {["grid","list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "8px 10px", borderRadius: 8,
                background: view === v ? "rgba(249,115,22,0.18)" : "#1a1d2e",
                border: `1.5px solid ${view === v ? "#f97316" : "#2a2d42"}`,
                color: view === v ? "#f97316" : "#8b90a8", cursor: "pointer",
              }}>{v === "grid" ? "⊞" : "≡"}</button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 40px", color: "#8b90a8" }}>
            <div style={{ fontSize: 50, marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: "#e8eaf0", marginBottom: 8 }}>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: view === "list" ? "1fr" : "repeat(auto-fill,minmax(220px,1fr))",
            gap: 18,
          }}>
            {sorted.map(p => (
              view === "list" ? (
                <div key={p.id} onClick={() => onOpenProduct(p)}
                  style={{ display: "grid", gridTemplateColumns: "160px 1fr", background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ background: "#13151f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>{p.emoji}</div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>{p.cat}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                    <Stars rating={p.rating} />
                    <span style={{ fontSize: 11, color: "#8b90a8", marginLeft: 6 }}>({p.reviews.toLocaleString()})</span>
                    <div style={{ margin: "10px 0", display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>${p.price}</span>
                      {p.oldPrice && <span style={{ fontSize: 14, color: "#555a7a", textDecoration: "line-through" }}>${p.oldPrice}</span>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); onAddToCart(p); showToast(`🛍️ "${p.name}" added!`); }}
                      style={{ padding: "9px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                <ProductCard key={p.id} product={p}
                  onOpen={onOpenProduct}
                  onAddToCart={prod => { onAddToCart(prod); showToast(`🛍️ "${prod.name}" added!`); }}
                  wishlist={wishlist}
                  onToggleWish={id => { onToggleWish(id); showToast(wishlist.has(id) ? "💔 Removed" : "❤️ Added to wishlist!"); }} />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ── PRODUCT DETAIL ──
const ProductPage = ({ product: p, onAddToCart, wishlist, onToggleWish, showToast }) => {
  const [qty, setQty]         = useState(1);
  const [selColor, setColor]  = useState(0);
  const [selSize, setSize]    = useState("M");
  const colors = ["#e63946","#457b9d","#2d6a4f","#f4a261","#adb5bd"];
  const sizes  = ["XS","S","M","L","XL"];
  const hasDisc = p.oldPrice && p.oldPrice > p.price;
  const savePct = hasDisc ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const isWished = wishlist.has(p.id);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
      {/* Gallery */}
      <div style={{ position: "sticky", top: 88 }}>
        <div style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, marginBottom: 12 }}>
          {p.emoji}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[p.emoji,p.emoji,p.emoji,p.emoji].map((e, i) => (
            <div key={i} style={{ width: 72, height: 72, borderRadius: 8, background: "#1a1d2e", border: `1.5px solid ${i === 0 ? "#f97316" : "#2a2d42"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer" }}>
              {e}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <div style={{ fontSize: 12, color: "#f97316", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{p.cat}</div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 14 }}>{p.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Stars rating={p.rating} />
          <span style={{ fontSize: 14, color: "#8b90a8" }}>{p.rating} ({p.reviews.toLocaleString()} reviews)</span>
        </div>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 38, fontWeight: 800 }}>${p.price}</span>
          {hasDisc && <span style={{ fontSize: 18, color: "#555a7a", textDecoration: "line-through", marginLeft: 12 }}>${p.oldPrice}</span>}
          {hasDisc && <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, marginTop: 6 }}>
            Save ${(p.oldPrice - p.price).toFixed(2)} ({savePct}% off)
          </div>}
        </div>
        <p style={{ fontSize: 14, color: "#8b90a8", lineHeight: 1.8, marginBottom: 24, borderTop: "1px solid #2a2d42", paddingTop: 20 }}>{p.desc}</p>

        {/* Colors */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Color</div>
          <div style={{ display: "flex", gap: 8 }}>
            {colors.map((c, i) => (
              <div key={i} onClick={() => setColor(i)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: `2px solid ${selColor === i ? "#f97316" : "transparent"}`, cursor: "pointer", transition: "transform 0.2s", transform: selColor === i ? "scale(1.15)" : "scale(1)" }} />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Size</div>
          <div style={{ display: "flex", gap: 8 }}>
            {sizes.map(s => (
              <div key={s} onClick={() => setSize(s)} style={{ padding: "6px 16px", borderRadius: 6, border: `1.5px solid ${selSize === s ? "#f97316" : "#2a2d42"}`, color: selSize === s ? "#f97316" : "#8b90a8", cursor: "pointer", transition: "all 0.2s", fontSize: 13 }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qty</span>
          <div style={{ display: "flex", background: "#13151f", border: "1px solid #2a2d42", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, fontSize: 18, color: "#e8eaf0", cursor: "pointer", background: "none", border: "none" }}>−</button>
            <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: 15, lineHeight: "36px", fontFamily: "'Sora',sans-serif" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, fontSize: 18, color: "#e8eaf0", cursor: "pointer", background: "none", border: "none" }}>+</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { onAddToCart(p, qty); showToast(`🛍️ "${p.name}" added to cart!`); }}
            style={{ flex: 1, padding: "14px 24px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 0 30px rgba(249,115,22,0.3)" }}>
            🛒 Add to Cart
          </button>
          <button onClick={() => { onToggleWish(p.id); showToast(isWished ? "💔 Removed from wishlist" : "❤️ Added to wishlist!"); }}
            style={{ padding: "14px 20px", background: "none", border: `1.5px solid ${isWished ? "#ef4444" : "#2a2d42"}`, color: isWished ? "#ef4444" : "#8b90a8", borderRadius: 40, cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
            {isWished ? "❤️" : "♡"} Wishlist
          </button>
        </div>

        {/* Features */}
        <div style={{ marginTop: 28, background: "#13151f", borderRadius: 8, padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[["🚀","Free Express Delivery"],["↩️","30-Day Returns"],["🔒","Secure Payment"],["✅","Authentic Products"]].map(([ic, lb]) => (
            <div key={lb} style={{ fontSize: 12, color: "#8b90a8", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{ic}</span>{lb}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── CART ──
const CartPage = ({ cart, updateQty, removeFromCart, onNavigate }) => {
  const [promo, setPromo]       = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    const p    = PROMO_CODES[code];
    if (!p) { setPromoMsg("❌ Invalid code. Try SAVE20 or FLAT50"); return; }
    const d = p.type === "percent" ? subtotal * p.value : Math.min(p.value, subtotal);
    setDiscount(d);
    setPromoMsg(`✅ ${p.label} applied!`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
      <div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
          🛒 Your Cart <span style={{ fontSize: 15, color: "#8b90a8" }}>({cart.reduce((s, c) => s + c.qty, 0)} items)</span>
        </h2>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8b90a8" }}>
            <div style={{ fontSize: 70, marginBottom: 20 }}>🛒</div>
            <h3 style={{ color: "#e8eaf0", marginBottom: 10 }}>Your cart is empty</h3>
            <button onClick={() => onNavigate("shop")} style={{ marginTop: 16, padding: "12px 28px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Start Shopping →</button>
          </div>
        ) : cart.map(({ product: p, qty }) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 20, alignItems: "center", background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ height: 90, background: "#13151f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{p.emoji}</div>
            <div>
              <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{p.cat}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif", marginBottom: 10 }}>${p.price.toFixed(2)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", background: "#13151f", border: "1px solid #2a2d42", borderRadius: 8, overflow: "hidden" }}>
                  <button onClick={() => updateQty(p.id, -1)} style={{ width: 32, height: 32, fontSize: 16, color: "#e8eaf0", cursor: "pointer", background: "none", border: "none" }}>−</button>
                  <span style={{ width: 36, textAlign: "center", fontWeight: 700, lineHeight: "32px" }}>{qty}</span>
                  <button onClick={() => updateQty(p.id, 1)}  style={{ width: 32, height: 32, fontSize: 16, color: "#e8eaf0", cursor: "pointer", background: "none", border: "none" }}>+</button>
                </div>
                <button onClick={() => removeFromCart(p.id)} style={{ fontSize: 18, color: "#555a7a", cursor: "pointer", background: "none", border: "none", padding: "4px 8px", borderRadius: 4 }}>🗑️</button>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Sora',sans-serif", textAlign: "right" }}>${(p.price * qty).toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 24, position: "sticky", top: 88 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #2a2d42" }}>Order Summary</h3>
        {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Shipping", "Free"], ["Tax (8%)", `$${tax.toFixed(2)}`]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#8b90a8" }}>
            <span>{l}</span><strong style={{ color: "#e8eaf0" }}>{v}</strong>
          </div>
        ))}
        {discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#22c55e" }}>
            <span>Promo Discount</span><strong>-${discount.toFixed(2)}</strong>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2a2d42", paddingTop: 16, marginTop: 4, fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800 }}>
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
          <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code (SAVE20)"
            style={{ flex: 1, padding: "10px 14px", background: "#13151f", border: "1.5px solid #2a2d42", borderRadius: 8, color: "#e8eaf0", fontSize: 13 }} />
          <button onClick={applyPromo} style={{ padding: "10px 16px", background: "#13151f", border: "1.5px solid #2a2d42", borderRadius: 8, color: "#e8eaf0", fontWeight: 600, cursor: "pointer" }}>Apply</button>
        </div>
        {promoMsg && <div style={{ fontSize: 12, color: promoMsg.startsWith("✅") ? "#22c55e" : "#ef4444", marginBottom: 12 }}>{promoMsg}</div>}
        <button onClick={() => onNavigate("checkout")} style={{ width: "100%", padding: 16, background: "#f97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 0 30px rgba(249,115,22,0.3)", marginTop: 8 }}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

// ── CHECKOUT ──
const CheckoutPage = ({ cart, onOrderPlaced }) => {
  const [step, setStep] = useState(1);
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;
  const [payMethod, setPayMethod] = useState("Credit Card");

  const StepIndicator = () => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {["Shipping","Payment","Review"].map((label, i) => {
        const n = i + 1;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, background: n < step ? "#22c55e" : n === step ? "#f97316" : "#2a2d42", color: n <= step ? "#fff" : "#8b90a8", border: "2px solid " + (n < step ? "#22c55e" : n === step ? "#f97316" : "#2a2d42") }}>{n < step ? "✓" : n}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: n === step ? "#e8eaf0" : "#8b90a8" }}>{label}</span>
            </div>
            {n < 3 && <div style={{ flex: 1, height: 1, background: "#2a2d42", margin: "0 12px" }} />}
          </div>
        );
      })}
    </div>
  );

  const FI = ({ label, placeholder, type = "text" }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#8b90a8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
      <input type={type} placeholder={placeholder} style={{ padding: "11px 14px", background: "#13151f", border: "1.5px solid #2a2d42", borderRadius: 8, color: "#e8eaf0", fontSize: 14 }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
      <div>
        <StepIndicator />
        <div style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 28 }}>
          {step === 1 && <>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📦 Shipping Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FI label="First Name" placeholder="John" />
              <FI label="Last Name"  placeholder="Doe" />
              <div style={{ gridColumn: "1/-1" }}><FI label="Email" placeholder="john@example.com" type="email" /></div>
              <div style={{ gridColumn: "1/-1" }}><FI label="Address" placeholder="123 Main Street" /></div>
              <FI label="City"     placeholder="New York" />
              <FI label="Zip Code" placeholder="10001" />
              <FI label="State"    placeholder="NY" />
              <FI label="Country"  placeholder="United States" />
              <div style={{ gridColumn: "1/-1" }}><FI label="Phone" placeholder="+1 (555) 000-0000" type="tel" /></div>
            </div>
            <button onClick={() => setStep(2)} style={{ marginTop: 20, padding: "12px 32px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Continue to Payment →</button>
          </>}

          {step === 2 && <>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>💳 Payment Method</h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {[["💳","Credit Card"],["📱","UPI / QR"],["🏦","Net Banking"],["💰","Cash on Delivery"]].map(([ic, lbl]) => (
                <div key={lbl} onClick={() => setPayMethod(lbl)} style={{ flex: 1, minWidth: 100, padding: 12, background: payMethod === lbl ? "rgba(249,115,22,0.18)" : "#13151f", border: `1.5px solid ${payMethod === lbl ? "#f97316" : "#2a2d42"}`, borderRadius: 8, textAlign: "center", cursor: "pointer", color: payMethod === lbl ? "#f97316" : "#8b90a8" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{lbl}</div>
                </div>
              ))}
            </div>
            {payMethod === "Credit Card" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1/-1" }}><FI label="Card Number" placeholder="1234 5678 9012 3456" /></div>
                <div style={{ gridColumn: "1/-1" }}><FI label="Cardholder Name" placeholder="John Doe" /></div>
                <FI label="Expiry" placeholder="MM/YY" />
                <FI label="CVV" placeholder="123" type="password" />
              </div>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={{ padding: "12px 24px", background: "none", border: "1.5px solid #2a2d42", color: "#e8eaf0", borderRadius: 40, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ padding: "12px 32px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Review Order →</button>
            </div>
          </>}

          {step === 3 && <>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>✅ Review & Place Order</h3>
            {cart.map(({ product: p, qty }) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #2a2d42" }}>
                <div style={{ width: 46, height: 46, background: "#13151f", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.emoji}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{p.name} × {qty}</div>
                <div style={{ fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>${(p.price * qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ background: "#13151f", borderRadius: 8, padding: 16, marginTop: 16 }}>
              {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Shipping", "Free"], ["Tax (8%)", `$${tax.toFixed(2)}`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#8b90a8" }}>
                  <span>{l}</span><strong style={{ color: "#e8eaf0" }}>{v}</strong>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #2a2d42", paddingTop: 12, marginTop: 4, fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800 }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={{ padding: "12px 24px", background: "none", border: "1.5px solid #2a2d42", color: "#e8eaf0", borderRadius: 40, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={onOrderPlaced} style={{ flex: 1, padding: "16px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>🎉 Place Order</button>
            </div>
          </>}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 24, position: "sticky", top: 88 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Order Items</h3>
        {cart.map(({ product: p, qty }) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #2a2d42" }}>
            <div style={{ width: 46, height: 46, background: "#13151f", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.emoji}</div>
            <div style={{ flex: 1, fontSize: 13 }}>{p.name} × {qty}</div>
            <div style={{ fontWeight: 700, fontFamily: "'Sora',sans-serif", fontSize: 14 }}>${(p.price * qty).toFixed(2)}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800 }}>
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ── WISHLIST ──
const WishlistPage = ({ wishlist, onOpen, onAddToCart, onToggleWish, showToast }) => {
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700 }}>❤️ My Wishlist</h2>
        <span style={{ color: "#8b90a8", fontSize: 14 }}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8b90a8" }}>
          <div style={{ fontSize: 70, marginBottom: 20 }}>💔</div>
          <h3 style={{ color: "#e8eaf0", marginBottom: 10 }}>Your wishlist is empty</h3>
          <p>Save products you love for later!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
          {items.map(p => (
            <ProductCard key={p.id} product={p} onOpen={onOpen}
              onAddToCart={prod => { onAddToCart(prod); showToast(`🛍️ "${prod.name}" added!`); }}
              wishlist={wishlist}
              onToggleWish={id => { onToggleWish(id); showToast("💔 Removed from wishlist"); }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── SUCCESS ──
const SuccessPage = ({ onContinue, orderCode }) => (
  <div style={{ maxWidth: 600, margin: "80px auto", padding: "40px", textAlign: "center" }}>
    <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
    <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>Order Placed Successfully!</h2>
    <p style={{ color: "#8b90a8", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>Thank you for your purchase! You'll receive a confirmation email shortly.</p>
    <div style={{ background: "#1a1d2e", border: "1px solid #2a2d42", borderRadius: 14, padding: 20, marginBottom: 28 }}>
      <div style={{ fontSize: 12, color: "#8b90a8", marginBottom: 6 }}>Your Order Number</div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#f97316", letterSpacing: 2 }}>{orderCode}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
      {[["📦","Confirmed"],["🏭","Processing"],["🚚","On the way"],["🏠","Delivered"]].map(([ic, lb]) => (
        <div key={lb} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{ic}</div>
          <div style={{ fontSize: 12, color: "#8b90a8" }}>{lb}</div>
        </div>
      ))}
    </div>
    <button onClick={onContinue} style={{ padding: "14px 32px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 0 30px rgba(249,115,22,0.3)" }}>
      Continue Shopping →
    </button>
  </div>
);

/* ─────────────────── APP ROOT ─────────────────── */
export default function App() {
  const [page, setPage]             = useState("home");    // home|shop|product|cart|checkout|wishlist|success
  const [shopCat, setShopCat]       = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [orderCode, setOrderCode]   = useState("");
  const [toast, showToast]          = useToast();
  const { cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, subtotal } = useCart();
  const wishlist = useWishlist();

  const navigate = (target, cat = null) => {
    setPage(target);
    if (cat) setShopCat(cat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (product) => {
    setCurrentProduct(product);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product, qty = 1) => addToCart(product, qty);

  const handleOrderPlaced = () => {
    const code = `#SN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    clearCart();
    setPage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const NavBtn = ({ label, icon, target, badge }) => (
    <button onClick={() => navigate(target)} style={{
      position: "relative", padding: "9px 16px", borderRadius: 8,
      fontSize: 13, fontWeight: 500, color: page === target ? "#f97316" : "#8b90a8",
      background: "none", border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 7, transition: "color 0.2s",
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>{label}
      {badge > 0 && <span style={{ background: "#f97316", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif" }}>{badge}</span>}
    </button>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0d0e14", color: "#e8eaf0", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,14,20,0.92)", backdropFilter: "blur(18px)", borderBottom: "1px solid #2a2d42", padding: "0 32px", height: 68, display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={() => navigate("home")} style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#f97316", letterSpacing: "-0.5px", cursor: "pointer" }}>
          Shop<span style={{ color: "#e8eaf0" }}>Nest</span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, display: "flex", background: "#13151f", border: "1.5px solid #2a2d42", borderRadius: 40, overflow: "hidden", maxWidth: 560 }}>
          <input
            placeholder="Search products, brands..."
            onKeyDown={e => { if (e.key === "Enter") navigate("shop"); }}
            style={{ flex: 1, padding: "10px 18px", background: "transparent", color: "#e8eaf0", fontSize: 14, border: "none", outline: "none" }} />
          <button onClick={() => navigate("shop")} style={{ padding: "10px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 40, margin: 3, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Search</button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <NavBtn label="Wishlist" icon="♡" target="wishlist" badge={wishlist.wishlist.length} />
          <NavBtn label="Cart" icon="🛒" target="cart" badge={cartTotal} />
        </div>
      </nav>

      {/* Pages */}
      {page === "home"     && <HomePage onNavigate={navigate} onOpenProduct={openProduct} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWish={wishlist.toggle} showToast={showToast} />}
      {page === "shop"     && <ShopPage initCat={shopCat} onOpenProduct={openProduct} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWish={wishlist.toggle} showToast={showToast} />}
      {page === "product"  && currentProduct && <ProductPage product={currentProduct} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWish={wishlist.toggle} showToast={showToast} />}
      {page === "cart"     && <CartPage cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} onNavigate={navigate} />}
      {page === "checkout" && <CheckoutPage cart={cart} onOrderPlaced={handleOrderPlaced} />}
      {page === "wishlist" && <WishlistPage wishlist={wishlist} onOpen={openProduct} onAddToCart={handleAddToCart} onToggleWish={wishlist.toggle} showToast={showToast} />}
      {page === "success"  && <SuccessPage orderCode={orderCode} onContinue={() => navigate("home")} />}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #2a2d42", padding: "40px", marginTop: 60, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, maxWidth: 1280, margin: "60px auto 0" }}>
        <div>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#f97316", marginBottom: 12 }}>Shop<span style={{ color: "#e8eaf0" }}>Nest</span></div>
          <p style={{ fontSize: 13, color: "#8b90a8", lineHeight: 1.7 }}>Your one-stop destination for premium products. Fast, reliable, and always authentic.</p>
        </div>
        {[["Shop", ["All Products","Deals","New Arrivals","Best Sellers"]], ["Support", ["Track Order","Returns","FAQs","Contact"]], ["Company", ["About","Blog","Careers","Privacy"]]].map(([title, links]) => (
          <div key={title}>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</h4>
            {links.map(l => <div key={l} style={{ fontSize: 13, color: "#8b90a8", marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
          </div>
        ))}
      </footer>
      <div style={{ borderTop: "1px solid #2a2d42", padding: "20px 40px", textAlign: "center", fontSize: 12, color: "#555a7a", maxWidth: 1280, margin: "0 auto" }}>© 2024 ShopNest. All rights reserved.</div>

      <Toast toast={toast} />
    </div>
  );
}
