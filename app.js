/* ============================================================
   ShopNest — app.js
   Client-side: routing, state management, product rendering,
   cart, wishlist, search, filters, checkout flow
   ============================================================ */

/* ===================== STATE ===================== */
let state = {
  products: [],      // loaded from API
  categories: [],    // loaded from API
  cart: [],          // [{ product, qty }]
  wishlist: [],      // [product.id]
  currentProduct: null,
  currentQty: 1,
  filterPrice: 2000,
  filterCategory: [],
  filterRating: 0,
  filterInStock: false,
  filterSale: false,
  searchQuery: '',
  sortBy: 'default',
  viewMode: 'grid',
  promoApplied: false,
  promoDiscount: 0,
  checkoutStep: 1,
};

/* ===================== PAGE ROUTING ===================== */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${id}`);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (id === 'shop')     renderProducts();
  if (id === 'cart')     renderCart();
  if (id === 'wishlist') renderWishlist();
  if (id === 'checkout') renderCheckout();
}

/* ===================== TOAST ===================== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ===================== CART ===================== */
async function addToCart(productId, qty = 1) {
  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, qty })
    });
    if (res.ok) {
      const cart = await res.json();
      state.cart = cart;
      updateCartBadge();
      const product = state.products.find(p => p.id === productId);
      showToast(`🛍️ "${product.name}" added to cart!`);
    }
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
}

async function removeFromCart(productId) {
  try {
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.ok) {
      const cart = await res.json();
      state.cart = cart;
      updateCartBadge();
      renderCart();
    }
  } catch (error) {
    console.error('Failed to remove from cart:', error);
  }
}

async function updateCartQty(productId, delta) {
  const item = state.cart.find(c => c.product.id === productId);
  if (!item) return;
  const newQty = Math.max(1, item.qty + delta);
  try {
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ qty: newQty })
    });
    if (res.ok) {
      const cart = await res.json();
      state.cart = cart;
      renderCart();
    }
  } catch (error) {
    console.error('Failed to update cart qty:', error);
  }
}

function updateCartBadge() {
  const total = state.cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cart-count').textContent = total;
}

function getCartSubtotal() {
  return state.cart.reduce((s, c) => s + c.product.price * c.qty, 0);
}

function applyPromo() {
  const code = document.getElementById('promo-code').value.trim().toUpperCase();
  if (code === 'SAVE20') {
    state.promoApplied = true;
    state.promoDiscount = 0.20;
    showToast('🎉 Promo code applied! 20% discount!');
  } else if (code === 'FLAT50') {
    state.promoApplied = true;
    state.promoDiscount = 50;
    showToast('🎉 $50 flat discount applied!');
  } else {
    showToast('❌ Invalid promo code. Try SAVE20 or FLAT50');
    return;
  }
  renderCart();
}

async function renderCart() {
  try {
    const res = await fetch('/api/cart', { credentials: 'include' });
    if (res.ok) {
      state.cart = await res.json();
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }

  const el = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-item-count');

  if (state.cart.length === 0) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-bottom:24px;font-size:14px">Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="showPage('shop')">Start Shopping →</button>
      </div>`;
    countEl.textContent = '';
  } else {
    countEl.textContent = `(${state.cart.reduce((s, c) => s + c.qty, 0)} items)`;
    el.innerHTML = state.cart.map(({ product, qty }) => `
      <div class="cart-item">
        <div class="cart-item-img">${product.emoji}</div>
        <div>
          <div class="cart-item-cat">${product.cat}</div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">$${product.price.toFixed(2)}</div>
          <div class="cart-item-ctrl">
            <div class="qty-ctrl">
              <button class="qty-btn" onclick="updateCartQty(${product.id},-1)">−</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-btn" onclick="updateCartQty(${product.id},1)">+</button>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${product.id})">🗑️</button>
          </div>
        </div>
        <div class="cart-item-total">$${(product.price * qty).toFixed(2)}</div>
      </div>`).join('');
  }

  const sub = getCartSubtotal();
  const tax = sub * 0.08;
  let discount = 0;
  if (state.promoApplied) {
    discount = typeof state.promoDiscount === 'number' && state.promoDiscount < 1
      ? sub * state.promoDiscount
      : Math.min(state.promoDiscount, sub);
  }
  const total = sub + tax - discount;

  document.getElementById('sum-subtotal').textContent = `$${sub.toFixed(2)}`;
  document.getElementById('sum-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('sum-total').textContent = `$${total.toFixed(2)}`;

  const discRow = document.getElementById('sum-discount-row');
  if (state.promoApplied && discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('sum-discount').textContent = `-$${discount.toFixed(2)}`;
  } else {
    discRow.style.display = 'none';
  }
}

/* ===================== WISHLIST ===================== */
async function toggleWishlist(productId) {
  try {
    const res = await fetch(`/api/wishlist/${productId}`, {
      method: 'POST',
      credentials: 'include'
    });
    if (res.ok) {
      const wishlist = await res.json();
      state.wishlist = wishlist;
      updateWishBadge();
      updateWishButtons();
      const added = wishlist.includes(productId);
      showToast(added ? '❤️ Added to wishlist!' : '💔 Removed from wishlist');
    }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
  }
}

function updateWishBadge() {
  const badge = document.getElementById('wish-count');
  const count = state.wishlist.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function updateWishButtons() {
  document.querySelectorAll('.card-wish').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    btn.classList.toggle('wishlisted', state.wishlist.includes(id));
    btn.textContent = state.wishlist.includes(id) ? '❤️' : '♡';
  });
}

async function renderWishlist() {
  try {
    const res = await fetch('/api/wishlist', { credentials: 'include' });
    if (res.ok) {
      state.wishlist = await res.json();
    }
  } catch (error) {
    console.error('Failed to load wishlist:', error);
  }

  const grid = document.getElementById('wishlist-grid');
  const badge = document.getElementById('wish-badge');
  const items = state.products.filter(p => state.wishlist.includes(p.id));
  badge.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
  if (items.length === 0) {
    grid.innerHTML = `
      <div class="wishlist-empty" style="grid-column:1/-1">
        <div class="icon">💔</div>
        <h3>Your wishlist is empty</h3>
        <p style="margin-bottom:24px;font-size:14px">Save items you love for later!</p>
        <button class="btn-primary" onclick="showPage('shop')">Discover Products →</button>
      </div>`;
  } else {
    grid.innerHTML = items.map(p => renderProductCard(p)).join('');
    updateWishButtons();
  }
}

/* ===================== PRODUCTS ===================== */
function renderProductCard(p, index = 0) {
  const inWish = state.wishlist.includes(p.id);
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const savePct = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  return `
    <div class="product-card" style="animation-delay:${index * 0.05}s" onclick="openProduct(${p.id})">
      <div class="card-img">
        ${p.badge ? `<div class="card-badges"><span class="card-badge ${p.badge}">${p.badge.toUpperCase()}</span></div>` : ''}
        <button class="card-wish ${inWish ? 'wishlisted' : ''}" data-id="${p.id}"
          onclick="event.stopPropagation();toggleWishlist(${p.id})">
          ${inWish ? '❤️' : '♡'}
        </button>
        ${p.emoji}
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-name">${p.name}</div>
        <div>
          <span class="card-stars">${stars}</span>
          <span class="card-reviews">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="card-pricing">
          <span class="card-price">$${p.price}</span>
          ${hasDiscount ? `<span class="card-old">$${p.oldPrice}</span><span class="card-save">-${savePct}%</span>` : ''}
        </div>
        <div class="card-footer">
          <button class="btn-add-cart" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
          <button class="btn-quick-view" onclick="event.stopPropagation();openProduct(${p.id})">👁</button>
        </div>
      </div>
    </div>`;
}

function getFilteredProducts() {
  let products = [...state.products];
  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }
  // Category
  if (state.filterCategory.length > 0) {
    products = products.filter(p => state.filterCategory.includes(p.cat));
  }
  // Price
  products = products.filter(p => p.price <= state.filterPrice);
  // Rating
  if (state.filterRating > 0) {
    products = products.filter(p => p.rating >= state.filterRating);
  }
  // Sale
  if (state.filterSale) {
    products = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  }
  // Sort
  switch (state.sortBy) {
    case 'price-asc':  products.sort((a, b) => a.price - b.price); break;
    case 'price-desc': products.sort((a, b) => b.price - a.price); break;
    case 'rating':     products.sort((a, b) => b.rating - a.rating); break;
    case 'newest':     products.sort((a, b) => b.id - a.id); break;
  }
  return products;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const filtered = getFilteredProducts();
  document.getElementById('product-shown-count').textContent = filtered.length;
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">
      <div style="font-size:50px;margin-bottom:16px">🔍</div>
      <h3 style="color:var(--text);margin-bottom:8px">No products found</h3>
      <p>Try adjusting your filters or search query</p>
    </div>`;
    return;
  }
  grid.innerHTML = filtered.map((p, i) => renderProductCard(p, i)).join('');
  if (state.viewMode === 'list') {
    grid.classList.add('list-view');
  } else {
    grid.classList.remove('list-view');
  }
  updateWishButtons();
}

/* ===================== FILTERS ===================== */
function initCategoryFilters() {
  // Sidebar
  const sidebar = document.getElementById('cat-filters');
  const counts = {};
  state.products.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  sidebar.innerHTML = state.categories.map(c => `
    <label class="filter-check">
      <input type="checkbox" value="${c.id}" onchange="toggleCatFilter('${c.id}',this.checked)">
      ${c.icon} ${c.label} <span class="cnt">${counts[c.id] || 0}</span>
    </label>`).join('');

  // Home cats
  const homeCats = document.getElementById('home-cats');
  homeCats.innerHTML = `
    <div class="cat-chip active" onclick="filterCatFromHome(null,this)"><span>🌐</span> All</div>
    ${state.categories.map(c => `<div class="cat-chip" onclick="filterCatFromHome('${c.id}',this)"><span>${c.icon}</span>${c.label}</div>`).join('')}`;

  // Shop cats (toolbar chip row)
  // Already handled by sidebar
}

function toggleCatFilter(cat, checked) {
  if (checked) {
    if (!state.filterCategory.includes(cat)) state.filterCategory.push(cat);
  } else {
    state.filterCategory = state.filterCategory.filter(c => c !== cat);
  }
  applyFilters();
}

function filterCatFromHome(cat, el) {
  document.querySelectorAll('#home-cats .cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showPage('shop');
  if (cat) {
    state.filterCategory = [cat];
    document.querySelectorAll('#cat-filters input[type="checkbox"]').forEach(cb => {
      cb.checked = cb.value === cat;
    });
  } else {
    state.filterCategory = [];
    document.querySelectorAll('#cat-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
  }
  renderProducts();
}

function updatePriceFilter(val) {
  state.filterPrice = parseInt(val);
  document.getElementById('price-val').textContent = `$${val}`;
  applyFilters();
}

function filterByRating(rating) {
  state.filterRating = state.filterRating === rating ? 0 : rating;
  applyFilters();
}

function applyFilters() {
  state.filterInStock = document.getElementById('instock-filter')?.checked || false;
  state.filterSale = document.getElementById('sale-filter')?.checked || false;
  state.sortBy = document.getElementById('sort-select')?.value || 'default';
  renderProducts();
}

function clearFilters() {
  state.filterCategory = [];
  state.filterPrice = 2000;
  state.filterRating = 0;
  state.filterInStock = false;
  state.filterSale = false;
  state.searchQuery = '';
  document.getElementById('price-range').value = 2000;
  document.getElementById('price-val').textContent = '$2000';
  document.getElementById('instock-filter').checked = false;
  document.getElementById('sale-filter').checked = false;
  document.getElementById('search-input').value = '';
  document.querySelectorAll('#cat-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
  renderProducts();
}

/* ===================== SEARCH ===================== */
function doSearch() {
  const q = document.getElementById('search-input').value.trim();
  state.searchQuery = q;
  state.filterCategory = [];
  showPage('shop');
  renderProducts();
}

document.getElementById('search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

/* ===================== VIEW MODE ===================== */
function setView(mode) {
  state.viewMode = mode;
  document.getElementById('grid-btn').classList.toggle('active', mode === 'grid');
  document.getElementById('list-btn').classList.toggle('active', mode === 'list');
  renderProducts();
}

function toggleFilters() {
  const sidebar = document.querySelector('.shop-sidebar');
  sidebar.classList.toggle('hidden');
}

/* ===================== PRODUCT DETAIL ===================== */
function openProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  state.currentProduct = p;
  state.currentQty = 1;

  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const savePct = hasDiscount ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));

  document.getElementById('pd-breadcrumb').innerHTML = `
    <a onclick="showPage('home')" style="cursor:pointer">Home</a>
    <span class="sep">›</span>
    <a onclick="showPage('shop')" style="cursor:pointer">Shop</a>
    <span class="sep">›</span>
    <span>${p.name}</span>`;

  document.getElementById('pd-main-img').textContent = p.emoji;
  document.getElementById('pd-thumbs').innerHTML = [p.emoji, p.emoji, p.emoji, p.emoji].map((e, i) =>
    `<div class="pd-thumb ${i === 0 ? 'active' : ''}" onclick="selectThumb(this,'${e}')">${e}</div>`).join('');

  document.getElementById('pd-cat').textContent = p.cat;
  document.getElementById('pd-name').textContent = p.name;
  document.getElementById('pd-stars').textContent = stars;
  document.getElementById('pd-rating-num').textContent = `${p.rating} (${p.reviews.toLocaleString()} reviews)`;
  document.getElementById('pd-price').textContent = `$${p.price}`;
  document.getElementById('pd-old').textContent = hasDiscount ? `$${p.oldPrice}` : '';
  const saveEl = document.getElementById('pd-save');
  if (hasDiscount) {
    saveEl.textContent = `You save $${(p.oldPrice - p.price).toFixed(2)} (${savePct}% off)`;
    saveEl.style.display = 'inline-block';
  } else {
    saveEl.style.display = 'none';
  }
  document.getElementById('pd-desc').textContent = p.desc;
  document.getElementById('pd-qty-num').textContent = '1';

  const wishBtn = document.getElementById('pd-add-wish');
  wishBtn.textContent = state.wishlist.includes(p.id) ? '❤️ Wishlisted' : '♡ Wishlist';

  showPage('product');
}

function selectThumb(el, emoji) {
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pd-main-img').textContent = emoji;
}

function selectColor(el) {
  document.querySelectorAll('.color-opt').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function selectSize(el) {
  document.querySelectorAll('.size-opt').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(delta) {
  state.currentQty = Math.max(1, state.currentQty + delta);
  document.getElementById('pd-qty-num').textContent = state.currentQty;
}

function addCurrentToCart() {
  if (!state.currentProduct) return;
  addToCart(state.currentProduct.id, state.currentQty);
}

function toggleWishCurrent() {
  if (!state.currentProduct) return;
  toggleWishlist(state.currentProduct.id);
  const btn = document.getElementById('pd-add-wish');
  btn.textContent = state.wishlist.includes(state.currentProduct.id) ? '❤️ Wishlisted' : '♡ Wishlist';
}

/* ===================== CHECKOUT ===================== */
function renderCheckout() {
  // Sidebar items
  const coItems = document.getElementById('checkout-items');
  coItems.innerHTML = state.cart.map(({ product, qty }) => `
    <div class="order-mini-item">
      <div class="order-mini-img">${product.emoji}</div>
      <div class="order-mini-name">${product.name} × ${qty}</div>
      <div class="order-mini-price">$${(product.price * qty).toFixed(2)}</div>
    </div>`).join('');

  const sub = getCartSubtotal();
  const tax = sub * 0.08;
  const total = sub + tax;
  document.getElementById('co-total').textContent = `$${total.toFixed(2)}`;

  // Review items
  const revItems = document.getElementById('review-items');
  revItems.innerHTML = state.cart.map(({ product, qty }) => `
    <div class="order-mini-item">
      <div class="order-mini-img">${product.emoji}</div>
      <div class="order-mini-name">${product.name} × ${qty}</div>
      <div class="order-mini-price">$${(product.price * qty).toFixed(2)}</div>
    </div>`).join('');

  document.getElementById('rev-subtotal').textContent = `$${sub.toFixed(2)}`;
  document.getElementById('rev-tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('rev-total').textContent = `$${total.toFixed(2)}`;

  goStep(1);
}

function goStep(n) {
  state.checkoutStep = n;
  ['checkout-step1', 'checkout-step2', 'checkout-step3'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('hidden', i + 1 !== n);
  });
  [1, 2, 3].forEach(i => {
    const el = document.getElementById(`step${i}`);
    el.classList.remove('active', 'done');
    if (i < n) el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
}

function selectPayment(el) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
}

async function placeOrder() {
  try {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.ok) {
      const code = '#SN-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('order-code').textContent = code;
      state.cart = [];
      state.promoApplied = false;
      state.promoDiscount = 0;
      updateCartBadge();
      showPage('success');
    }
  } catch (error) {
    console.error('Failed to place order:', error);
  }
}

function continueShopping() {
  state.searchQuery = '';
  state.filterCategory = [];
  showPage('home');
}

/* ===================== HOME SETUP ===================== */
function renderHeroCards() {
  const featured = [state.products[0], state.products[1], state.products[4], state.products[8]];
  document.getElementById('hero-visual').innerHTML = featured.map(p => `
    <div class="hero-card" onclick="openProduct(${p.id})" style="cursor:pointer">
      <div class="hero-card-img">${p.emoji}</div>
      <div class="hero-card-name">${p.name.substring(0, 28)}${p.name.length > 28 ? '...' : ''}</div>
      <div class="hero-card-price">$${p.price}</div>
    </div>`).join('');
}

function renderFeatured() {
  const featured = state.products.filter(p => p.badge).slice(0, 8);
  document.getElementById('featured-products').innerHTML =
    featured.map((p, i) => renderProductCard(p, i)).join('');
  updateWishButtons();
}

/* ===================== INIT ===================== */
async function init() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories')
    ]);
    state.products = await productsRes.json();
    state.categories = await categoriesRes.json();
    renderHeroCards();
    renderFeatured();
    initCategoryFilters();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

init();
