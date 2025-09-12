// DU DOCES – app.js (compatível com o seu último index.html vermelho)

// ===== Defaults / Fallback =====
const DEFAULT_CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "balas", label: "Balas" },
  { id: "chicletes", label: "Chicletes" },
  { id: "chocolates", label: "Chocolates" },
  { id: "outros", label: "Outros" },
];

const DEFAULT_BRANDS = [
  { id: "todas", label: "Todas as Marcas", logo: "" },
  { id: "arcor", label: "Arcor", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Arcor_logo.png" },
  { id: "nestle", label: "Nestlé", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nestle_textlogo_blue.svg" },
  { id: "trident", label: "Trident", logo: "" },
  { id: "santafe", label: "Santa Fe", logo: "" },
  { id: "dori", label: "Dori", logo: "" },
  { id: "soberana", label: "Soberana", logo: "" },
  { id: "primor", label: "Primor", logo: "" },
  { id: "chita", label: "Chita", logo: "" },
  { id: "ourolux", label: "Ourolux", logo: "" },
  { id: "lacta", label: "Lacta", logo: "" },
  { id: "garoto", label: "Garoto", logo: "" },
  { id: "copag", label: "Copag", logo: "" },
];

const DEFAULT_BANNERS = [
  { image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1470&auto=format&fit=crop", href: "#" },
  { image: "https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?q=80&w=1470&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1470&auto=format&fit=crop" }
];

const FALLBACK_IMG = {
  balas: "https://picsum.photos/800/800?random=11",
  chicletes: "https://picsum.photos/800/800?random=22",
  chocolates: "https://picsum.photos/800/800?random=33",
  outros: "https://picsum.photos/800/800?random=44",
};

// ===== Estado =====
let CATEGORIES = DEFAULT_CATEGORIES.slice();
let BRANDS = DEFAULT_BRANDS.slice();
let BANNERS = DEFAULT_BANNERS.slice();
let PRODUCTS = []; // vem do products.json

let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  promoOnly: false,
  sort: "relevancia",
  cart: [],
  bannerIndex: 0,
  dark: false,
};

// ===== Seletores (batendo com seu index.html) =====
const btnMenu = document.getElementById("btnMenu");
const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");
const toggleDark = document.getElementById("toggleDark");

const bannerTrack = document.getElementById("bannerTrack");
const bannerDots = document.getElementById("bannerDots");

const brandRow = document.getElementById("brandRow");
const catRow = document.getElementById("catRow");
const sortSelect = document.getElementById("sortSelect");
const promoOnly = document.getElementById("promoOnly");
const searchInput = document.getElementById("searchInput");

const grid = document.getElementById("grid");

const btnCart = document.getElementById("btnCart");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartFrete = document.getElementById("cartFrete");
const cartCount = document.getElementById("cartCount");

const cepInput = document.getElementById("cepInput");

const adminModal = document.getElementById("adminModal");
const btnLogin = document.getElementById("btnLogin");
const cancelAdmin = document.getElementById("cancelAdmin");
const submitAdmin = document.getElementById("submitAdmin");

const toggleChat = document.getElementById("toggleChat");
const chatEmbed = document.getElementById("chatEmbed");

// ===== Utils =====
const fmtBRL = (n) =>
  isFinite(n) ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";

function maskCEP(v) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

// Frete estimado (mock por faixa CEP + quantidade itens)
function estimateShipping(cep) {
  const digits = (cep || "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  const d2 = parseInt(digits.slice(0, 2), 10);
  let base = 19.9;
  if (d2 <= 19) base = 21.9; // SE/SUL
  else if (d2 <= 59) base = 24.9; // CO/NE
  else base = 29.9; // Norte
  const qnt = state.cart.reduce((a, i) => a + i.qty, 0);
  const extra = Math.max(0, qnt - 3) * 2.5;
  return +(base + extra).toFixed(2);
}

// Persistência
function saveState() {
  localStorage.setItem("dd_cart", JSON.stringify(state.cart));
  localStorage.setItem("dd_cep", cepInput.value || "");
  localStorage.setItem("dd_dark", state.dark ? "1" : "0");
}
function loadState() {
  try {
    const c = JSON.parse(localStorage.getItem("dd_cart") || "[]");
    if (Array.isArray(c)) state.cart = c;
    const cep = localStorage.getItem("dd_cep");
    if (cep) cepInput.value = cep;
    state.dark = localStorage.getItem("dd_dark") === "1";
    document.body.classList.toggle("dark", state.dark);
  } catch (e) {}
}

// ===== Loads (JSONs) =====
async function loadProducts() {
  try {
    const r = await fetch("assets/products.json", { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    PRODUCTS = Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Falha ao carregar products.json", e);
    PRODUCTS = [];
  }
}
async function loadBrands() {
  try {
    const r = await fetch("assets/brands.json", { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    BRANDS = Array.isArray(data) && data.length ? data : DEFAULT_BRANDS;
  } catch (e) {
    console.warn("Falha ao carregar brands.json", e);
    BRANDS = DEFAULT_BRANDS;
  }
}
async function loadBanners() {
  try {
    const r = await fetch("assets/banners.json", { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    BANNERS = Array.isArray(data) && data.length ? data : DEFAULT_BANNERS;
  } catch (e) {
    console.warn("Falha ao carregar banners.json", e);
    BANNERS = DEFAULT_BANNERS;
  }
}

// ===== UI – Drawer / Dark mode =====
btnMenu?.addEventListener("click", () => drawer.classList.add("open"));
closeDrawer?.addEventListener("click", () => drawer.classList.remove("open"));
toggleDark?.addEventListener("click", (e) => {
  e.preventDefault();
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
  saveState();
});

// swipe close no painel (mobile)
let startX = null;
drawer?.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });
drawer?.addEventListener("touchmove", (e) => {
  if (startX == null) return;
  const dx = e.touches[0].clientX - startX;
  if (dx < -60) { drawer.classList.remove("open"); startX = null; }
}, { passive: true });

// ===== Banners =====
let bannerTimer = null;
function renderBanners() {
  bannerTrack.innerHTML = BANNERS.map(b => {
    const style = `style="background:url('${b.image}') center/cover"`;
    return b.href ? `<a class="banner" href="${b.href}" ${style}></a>` : `<div class="banner" ${style}></div>`;
  }).join("");
  renderBannerDots();
  updateBanner();
  restartBannerTimer();
}
function renderBannerDots() {
  bannerDots.innerHTML = "";
  for (let i = 0; i < BANNERS.length; i++) {
    const d = document.createElement("button");
    d.className = i === state.bannerIndex ? "active" : "";
    d.onclick = () => { state.bannerIndex = i; updateBanner(); restartBannerTimer(); };
    bannerDots.appendChild(d);
  }
}
function updateBanner() {
  if (!bannerTrack || BANNERS.length === 0) return;
  bannerTrack.style.transform = `translateX(-${state.bannerIndex * 100}%)`;
  [...bannerDots.children].forEach((el, idx) =>
    el.classList.toggle("active", idx === state.bannerIndex)
  );
}
function nextBanner() {
  state.bannerIndex = (state.bannerIndex + 1) % BANNERS.length;
  updateBanner();
}
function restartBannerTimer() {
  if (bannerTimer) clearInterval(bannerTimer);
  bannerTimer = setInterval(nextBanner, 5000);
}

// ===== Marcas / Categorias =====
function renderBrands() {
  brandRow.innerHTML = "";
  BRANDS.forEach((b) => {
    const el = document.createElement("button");
    el.className = "brand-btn" + (state.brand === b.id ? " active" : "");
    el.innerHTML = b.logo
      ? `<img src="${b.logo}" alt="${b.label}"><strong>${b.id === "todas" ? "Todas as Marcas" : b.label}</strong>`
      : `<strong>${b.label}</strong>`;
    el.onclick = () => { state.brand = b.id; renderProducts(); renderBrands(); };
    brandRow.appendChild(el);
  });
}
function renderCatChips() {
  catRow.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (state.cat === c.id ? " active" : "");
    btn.dataset.cat = c.id;
    btn.textContent = c.id === "chicletes" ? `🍬 ${c.label}` : c.label;
    btn.onclick = () => { state.cat = c.id; renderProducts(); renderCatChips(); };
    catRow.appendChild(btn);
  });
}

// ===== Produtos / Filtros =====
function filteredProducts() {
  let items = PRODUCTS.filter(p =>
    (state.cat === "todas" || p.category === state.cat) &&
    (state.brand === "todas" || p.brand === state.brand) &&
    (!state.promoOnly || p.promo) &&
    (p.name.toLowerCase().includes(state.search.toLowerCase()))
  );
  if (state.sort === "preco_asc") items.sort((a, b) => a.price - b.price);
  if (state.sort === "preco_desc") items.sort((a, b) => b.price - a.price);
  return items;
}
function renderProducts() {
  const items = filteredProducts();
  if (!items.length) {
    grid.innerHTML = `<div class="no-results" style="text-align:center;opacity:.8;padding:20px">Nenhum produto encontrado.</div>`;
    return;
  }
  grid.innerHTML = items.map(p => {
    const src = FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
    const brandName = (p.brand || "").toUpperCase();
    const inCart = !!state.cart.find(i => i.id === p.id);
    const stockBadge = (p.stock ?? 0) > 0 ? ((p.stock <= 10) ? "Últimas unidades" : "Em estoque") : "Sem estoque";
    return `
      <div class="card">
        <div class="badges">
          <span class="badge stock">${stockBadge}</span>
          ${p.promo ? `<span class="badge promo">PROMO</span>` : ""}
        </div>
        <div class="thumb"><img src="${src}" alt="${p.name}"></div>
        <div class="body">
          <div class="title">${p.name}</div>
          <div class="brand-tag">${brandName} • ${p.unit}</div>
          <div class="price">
            ${p.promo && p.oldPrice ? `<s style="opacity:.6;margin-right:6px">${fmtBRL(p.oldPrice)}</s>` : ""}
            ${fmtBRL(p.price)}
          </div>
          <button class="btn primary add ${inCart ? "in-cart" : ""}" data-id="${p.id}">
            ${inCart ? "No carrinho ✓" : "Adicionar"}
          </button>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".add").forEach((btn) => {
    btn.onclick = () => addToCart(PRODUCTS.find(p => p.id == btn.dataset.id));
  });
}

// ===== Carrinho =====
btnCart.onclick = () => cartDrawer.classList.add("open");
closeCart.onclick = () => cartDrawer.classList.remove("open");

function addToCart(p) {
  const found = state.cart.find(i => i.id === p.id);
  if (found) found.qty++;
  else state.cart.push({ ...p, qty: 1 });
  saveState();
  renderCart();
  renderProducts(); // atualiza texto do botão
}

function changeQty(id, delta) {
  const i = state.cart.findIndex(x => x.id === id);
  if (i < 0) return;
  const q = (state.cart[i].qty || 0) + delta;
  if (q <= 0) state.cart.splice(i, 1);
  else state.cart[i].qty = q;
  saveState();
  renderCart();
  renderProducts();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0, count = 0;

  if (state.cart.length === 0) {
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  } else {
    state.cart.forEach(i => {
      total += i.price * i.qty;
      count += i.qty;
      const src = FALLBACK_IMG[i.category] || FALLBACK_IMG.outros;
      cartList.innerHTML += `
        <div class="cart-item">
          <img src="${src}" alt="${i.name}">
          <div>
            <div style="font-weight:700">${i.name}</div>
            <small>${fmtBRL(i.price)} • ${i.unit}</small>
          </div>
          <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
            <button class="btn secondary qty-dec" data-id="${i.id}">-</button>
            <strong>${i.qty}</strong>
            <button class="btn primary qty-inc" data-id="${i.id}">+</button>
          </div>
        </div>`;
    });
  }

  const ship = estimateShipping(cepInput.value);
  cartTotal.textContent = fmtBRL(total);
  cartFrete.textContent = ship ? fmtBRL(ship) : "—";
  cartCount.textContent = count;

  cartList.querySelectorAll(".qty-inc").forEach(b => b.onclick = () => changeQty(+b.dataset.id, +1));
  cartList.querySelectorAll(".qty-dec").forEach(b => b.onclick = () => changeQty(+b.dataset.id, -1));
}

// CEP + frete live
cepInput.addEventListener("input", (e) => {
  const pos = e.target.selectionStart;
  e.target.value = maskCEP(e.target.value);
  saveState();
  renderCart();
  try { e.target.setSelectionRange(pos, pos); } catch (_){}
});

// ===== Login (mock) =====
btnLogin.onclick = () => adminModal.classList.add("open");
cancelAdmin.onclick = () => adminModal.classList.remove("open");
submitAdmin.onclick = () => {
  alert("Login mockado: admin@dudoces.com • senha: 123456");
  adminModal.classList.remove("open");
};

// ===== Chat =====
toggleChat.onclick = () => chatEmbed.classList.toggle("open");

// ===== Controles de filtro =====
sortSelect.onchange = (e) => { state.sort = e.target.value; renderProducts(); };
promoOnly.onchange = (e) => { state.promoOnly = e.target.checked; renderProducts(); };
searchInput.oninput = (e) => { state.search = e.target.value; renderProducts(); };

// ===== Init =====
async function init() {
  loadState();

  await Promise.all([
    loadProducts(),
    loadBrands(),
    loadBanners(),
  ]);

  renderBrands();
  renderCatChips();
  renderProducts();
  renderCart();

  renderBanners();
}
init();
