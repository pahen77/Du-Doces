// Dados
const CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'balas', label: 'Balas' },
  { id: 'chicletes', label: 'Chicletes' },
  { id: 'chocolates', label: 'Chocolates' },
  { id: 'outros', label: 'Outros' },
];

const BRANDS = [
  { id: 'todas', label: 'Todas' },
  { id: 'arcor', label: 'Arcor' },
  { id: 'nestle', label: 'Nestlé' },
  { id: 'trident', label: 'Trident' },
];

const FALLBACK_IMG = {
  balas: 'https://picsum.photos/200/150?balas',
  chicletes: 'https://picsum.photos/200/150?chiclete',
  chocolates: 'https://picsum.photos/200/150?choco',
  outros: 'https://picsum.photos/200/150?outros',
};

const PRODUCTS = [
  { id: 1, name: 'Bala Pipper Dura', brand: 'arcor', category: 'balas', price: 6.95, unit: 'pacote' },
  { id: 2, name: 'Trident Menta', brand: 'trident', category: 'chicletes', price: 35.70, unit: 'caixa' },
  { id: 3, name: 'Suflair unidade', brand: 'nestle', category: 'chocolates', price: 4.99, unit: 'unidade' }
];

// Estado
let state = { cat: 'todas', brand: 'todas', search: '', cart: [] };
const fmt = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Render categorias
const catRow = document.getElementById('catRow');
function renderCatChips() {
  catRow.innerHTML = '';
  CATEGORIES.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (state.cat === c.id ? ' active' : '');
    btn.dataset.cat = c.id;
    btn.textContent = c.id === 'chicletes' ? `🍬 ${c.label}` : c.label;
    btn.onclick = () => { state.cat = c.id; renderProducts(); renderCatChips(); };
    catRow.appendChild(btn);
  });
}

// Render marcas
const brandRow = document.getElementById('brandRow');
function renderBrands() {
  brandRow.innerHTML = '';
  BRANDS.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'brand-btn' + (state.brand === b.id ? ' active' : '');
    btn.textContent = b.label;
    btn.onclick = () => { state.brand = b.id; renderProducts(); renderBrands(); };
    brandRow.appendChild(btn);
  });
}

// Render produtos
const grid = document.getElementById('grid');
function renderProducts() {
  let items = PRODUCTS.filter(p =>
    (state.cat === 'todas' || p.category === state.cat) &&
    (state.brand === 'todas' || p.brand === state.brand) &&
    p.name.toLowerCase().includes(state.search.toLowerCase())
  );
  grid.innerHTML = items.map(p => `
    <div class="card">
      <img src="${FALLBACK_IMG[p.category]}" alt="${p.name}">
      <div class="body">
        <div>${p.name}</div>
        <div>${fmt(p.price)} • ${p.unit}</div>
        <button class="add" data-id="${p.id}">Adicionar</button>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.add').forEach(btn => {
    btn.onclick = () => addToCart(PRODUCTS.find(p => p.id == btn.dataset.id));
  });
}

// Carrinho
const cartDrawer = document.getElementById('cartDrawer');
const btnCart = document.getElementById('btnCart');
const closeCartBtn = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

btnCart.onclick = () => cartDrawer.classList.add('open');
closeCartBtn.onclick = () => cartDrawer.classList.remove('open');

function addToCart(p) {
  const found = state.cart.find(i => i.id === p.id);
  if (found) found.qty++;
  else state.cart.push({ ...p, qty: 1 });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = '';
  let total = 0, count = 0;
  state.cart.forEach(i => {
    total += i.price * i.qty;
    count += i.qty;
    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${FALLBACK_IMG[i.category]}" width="40">
        <div>${i.name}<br><small>${fmt(i.price)} • ${i.unit}</small></div>
        <div>${i.qty}</div>
      </div>
    `;
  });
  cartTotal.textContent = fmt(total);
  cartCount.textContent = count;
}

// Login modal
const adminModal = document.getElementById('adminModal');
document.getElementById('btnLogin').onclick = () => adminModal.classList.add('open');
document.getElementById('cancelAdmin').onclick = () => adminModal.classList.remove('open');
document.getElementById('submitAdmin').onclick = () => {
  alert('Login mockado: admin@dudoces.com / 123456');
  adminModal.classList.remove('open');
};

// Chat IA
document.getElementById('toggleChat').onclick = () =>
  document.getElementById('chatEmbed').classList.toggle('open');

// Inicialização
function init() {
  renderCatChips();
  renderBrands();
  renderProducts();
  renderCart();
}
init();
