// ======================
// ===== Dados base =====
// ======================
const CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "balas", label: "Balas" },
  { id: "chicletes", label: "Chicletes" },
  { id: "chocolates", label: "Chocolates" },
  { id: "outros", label: "Outros" },
];

const BRANDS = [
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

const FALLBACK_IMG = {
  balas: "https://picsum.photos/800/800?random=11",
  chicletes: "https://picsum.photos/800/800?random=22",
  chocolates: "https://picsum.photos/800/800?random=33",
  outros: "https://picsum.photos/800/800?random=44",
};

// Produtos de exemplo (pode trocar depois por JSON)
const PRODUCTS = [
  { id: 101, name: "Bala Pipper Dura", brand: "santafe", category: "balas", price: 6.95, unit: "pacote" },
  { id: 102, name: "Bala Pipper Mastigável", brand: "santafe", category: "balas", price: 5.95, unit: "pacote" },
  { id: 103, name: "Bala de Mel", brand: "dori", category: "balas", price: 8.99, unit: "pacote" },
  { id: 109, name: "Suflair unidade", brand: "nestle", category: "chocolates", price: 4.99, unit: "unidade" },
  { id: 110, name: "Suflair caixa", brand: "nestle", category: "chocolates", price: 99.50, unit: "caixa" },
  { id: 123, name: "Trident caixa Menta", brand: "trident", category: "chicletes", price: 35.70, unit: "caixa" },
  { id: 124, name: "Trident caixa Hortelã", brand: "trident", category: "chicletes", price: 35.70, unit: "caixa" },
  { id: 121, name: "Baralho Copag unidade", brand: "copag", category: "outros", price: 11.50, unit: "unidade" },
  { id: 108, name: "Lâmpada 9W", brand: "ourolux", category: "outros", price: 2.99, unit: "unidade" },
];

// ======================
// =====   Estado   =====
// ======================
let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  cart: [],
  sort: "relevancia",
  promoOnly: false,
  bannerIndex: 0,
};

// ======================
// ===== Utilitários ====
// ======================
const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ======================
// ===== Seletores  =====
// ======================
const grid = document.getElementById("grid");
const brandRow = document.getElementById("brandRow");
const catRow = document.getElementById("catRow");
const sortSelect = document.getElementById("sortSelect");
const promoOnly = document.getElementById("promoOnly");
const searchInput = document.getElementById("searchInput");
const cepInput = document.getElementById("cepInput");

const cartDrawer = document.getElementById("cartDrawer");
const btnCart = document.getElementById("btnCart");
const closeCartBtn = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const btnDrawer = document.getElementById("btnDrawer");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");

const bannerTrack = document.getElementById("bannerTrack");
const bannerDots = document.getElementById("bannerDots");

// ======================
// =====  Render UI  ====
// ======================
function renderBrands() {
  brandRow.innerHTML = "";
  BRANDS.forEach((b) => {
    const btn = document.createElement("button");
    btn.className = "brand-btn" + (state.brand === b.id ? " active" : "");
    btn.innerHTML = b.logo
      ? `<img src="${b.logo}" alt="${b.label}"><strong>${b.id === "todas" ? "Todas as Marcas" : b.label}</strong>`
      : `<strong>${b.label}</strong>`;
    btn.onclick = () => {
      state.brand = b.id;
      renderProducts();
      renderBrands();
    };
    brandRow.appendChild(btn);
  });
}

function renderCatChips() {
  catRow.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (state.cat === c.id ? " active" : "");
    btn.dataset.cat = c.id;
    btn.innerHTML = c.id === "chicletes" ? `🍬 ${c.label}` : c.label;
    btn.onclick = () => {
      state.cat = c.id;
      renderProducts();
      renderCatChips();
    };
    catRow.appendChild(btn);
  });
}

function filteredProducts() {
  let items = PRODUCTS.filter(
    (p) =>
      (state.cat === "todas" || p.category === state.cat) &&
      (state.brand === "todas" || p.brand === state.brand) &&
      (!state.promoOnly || p.promo) &&
      p.name.toLowerCase().includes(state.search.toLowerCase())
  );
  if (state.sort === "preco_asc") items.sort((a, b) => a.price - b.price);
  if (state.sort === "preco_desc") items.sort((a, b) => b.price - a.price);
  return items;
}

function renderProducts() {
  const items = filteredProducts();
  grid.innerHTML = items
    .map((p) => {
      const src = FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
      const brandName = (p.brand || "").toUpperCase();
      return `
        <div class="card">
          <img src="${src}" alt="${p.name}">
          <div class="body">
            <div class="title">${p.name}</div>
            <div class="brand-tag">${brandName} • ${p.unit}</div>
            <div class="price">${fmtBRL(p.price)}</div>
            <button class="add" data-id="${p.id}">Adicionar</button>
          </div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll(".add").forEach((btn) => {
    btn.onclick = () => addToCart(PRODUCTS.find((p) => p.id == btn.dataset.id));
  });
}

// ======================
// =====  Carrinho  =====
// ======================
btnCart.onclick = () => cartDrawer.classList.add("open");
closeCartBtn.onclick = () => cartDrawer.classList.remove("open");

function addToCart(p) {
  const found = state.cart.find((i) => i.id === p.id);
  if (found) found.qty++;
  else state.cart.push({ ...p, qty: 1 });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  let count = 0;

  if (state.cart.length === 0) {
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  } else {
    state.cart.forEach((i) => {
      total += i.price * i.qty;
      count += i.qty;
      const src = FALLBACK_IMG[i.category] || FALLBACK_IMG.outros;
      cartList.innerHTML += `
        <div class="cart-item">
          <img src="${src}" width="50" height="50" alt="${i.name}">
          <div>
            <div style="font-weight:700">${i.name}</div>
            <small>${fmtBRL(i.price)} • ${i.unit}</small>
          </div>
          <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
            <button class="qty-dec" data-id="${i.id}">-</button>
            <strong>${i.qty}</strong>
            <button class="qty-inc" data-id="${i.id}">+</button>
          </div>
        </div>
      `;
    });
  }

  cartTotal.textContent = fmtBRL(total);
  cartCount.textContent = count;

  cartList.querySelectorAll(".qty-inc").forEach((b) => {
    b.onclick = () => changeQty(+b.dataset.id, +1);
  });
  cartList.querySelectorAll(".qty-dec").forEach((b) => {
    b.onclick = () => changeQty(+b.dataset.id, -1);
  });
}

function changeQty(id, delta) {
  const i = state.cart.findIndex((x) => x.id === id);
  if (i < 0) return;
  const q = state.cart[i].qty + delta;
  if (q <= 0) state.cart.splice(i, 1);
  else state.cart[i].qty = q;
  renderCart();
}

// ======================
// =====   Banners  =====
// ======================
let bannerTimer = null;

function renderBannerDots() {
  bannerDots.innerHTML = "";
  [0, 1, 2].forEach((i) => {
    const b = document.createElement("button");
    b.className = i === state.bannerIndex ? "active" : "";
    b.onclick = () => {
      state.bannerIndex = i;
      updateBanner();
      restartBannerTimer();
    };
    bannerDots.appendChild(b);
  });
}

function updateBanner() {
  if (!bannerTrack) return;
  bannerTrack.style.transform = `translateX(-${state.bannerIndex * 100}%)`;
  renderBannerDots();
}

function nextBanner() {
  state.bannerIndex = (state.bannerIndex + 1) % 3;
  updateBanner();
}

function restartBannerTimer() {
  if (bannerTimer) clearInterval(bannerTimer);
  bannerTimer = setInterval(nextBanner, 5000);
}

// ======================
// =====    Menu    =====
// ======================
btnDrawer?.addEventListener("click", () => drawer.classList.add("open"));
drawerBackdrop?.addEventListener("click", () => drawer.classList.remove("open"));

// ======================
// =====   Login    =====
// ======================
const adminModal = document.getElementById("adminModal");
document.getElementById("btnLogin").onclick = () => adminModal.classList.add("open");
document.getElementById("cancelAdmin").onclick = () => adminModal.classList.remove("open");
document.getElementById("submitAdmin").onclick = () => {
  alert("Login mockado: admin@dudoces.com / 123456");
  adminModal.classList.remove("open");
};

// ======================
// =====    Chat    =====
// ======================
document.getElementById("toggleChat").onclick = () =>
  document.getElementById("chatEmbed").classList.toggle("open");

// ======================
// =====  Controles =====
// ======================
sortSelect.onchange = (e) => {
  state.sort = e.target.value;
  renderProducts();
};
promoOnly.onchange = (e) => {
  state.promoOnly = e.target.checked;
  renderProducts();
};
searchInput.oninput = (e) => {
  state.search = e.target.value;
  renderProducts();
};

// CEP persistido
if (localStorage.getItem("cep")) cepInput.value = localStorage.getItem("cep");
cepInput.oninput = (e) => localStorage.setItem("cep", e.target.value);

// ======================
// ===== Inicializar ====
// ======================
function init() {
  renderBrands();
  renderCatChips();
  renderProducts();
  renderCart();
  updateBanner();
  restartBannerTimer();
}
init();
