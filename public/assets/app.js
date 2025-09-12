// ===== Dados base =====
const CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "balas", label: "Balas" },
  { id: "chicletes", label: "Chicletes" },
  { id: "chocolates", label: "Chocolates" },
  { id: "outros", label: "Outros" },
];

const BRANDS = [
  { id: "todas", label: "Todas as Marcas" },
  { id: "arcor", label: "Arcor" },
  { id: "nestle", label: "Nestlé" },
  { id: "trident", label: "Trident" },
  { id: "santafe", label: "Santa Fe" },
  { id: "dori", label: "Dori" },
  { id: "soberana", label: "Soberana" },
  { id: "primor", label: "Primor" },
  { id: "chita", label: "Chita" },
  { id: "ourolux", label: "Ourolux" },
  { id: "lacta", label: "Lacta" },
  { id: "garoto", label: "Garoto" },
  { id: "copag", label: "Copag" },
];

const FALLBACK_IMG = {
  balas: "https://picsum.photos/200/150?balas",
  chicletes: "https://picsum.photos/200/150?chiclete",
  chocolates: "https://picsum.photos/200/150?choco",
  outros: "https://picsum.photos/200/150?outros",
};

// Alguns produtos de exemplo
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

// ===== Estado =====
let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  cart: [],
  sort: "relevancia",
  promoOnly: false,
};

// ===== Utils =====
const fmtBRL = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ===== Render Categorias =====
const catRow = document.getElementById("catRow");
function renderCatChips() {
  catRow.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (state.cat === c.id ? " active" : "");
    btn.dataset.cat = c.id;
    btn.textContent = c.id === "chicletes" ? `🍬 ${c.label}` : c.label;
    btn.onclick = () => {
      state.cat = c.id;
      renderProducts();
      renderCatChips();
    };
    catRow.appendChild(btn);
  });
}

// ===== Render Marcas =====
const brandRow = document.getElementById("brandRow");
function renderBrands() {
  brandRow.innerHTML = "";
  BRANDS.forEach((b) => {
    const btn = document.createElement("div");
    btn.className = "brand-logo" + (state.brand === b.id ? " active" : "");
    btn.textContent = b.label;
    btn.onclick = () => {
      state.brand = b.id;
      renderProducts();
      renderBrands();
    };
    brandRow.appendChild(btn);
  });
}

// ===== Render Produtos =====
const grid = document.getElementById("grid");
function renderProducts() {
  let items = PRODUCTS.filter(
    (p) =>
      (state.cat === "todas" || p.category === state.cat) &&
      (state.brand === "todas" || p.brand === state.brand) &&
      (!state.promoOnly || p.promo) &&
      p.name.toLowerCase().includes(state.search.toLowerCase())
  );

  if (state.sort === "preco_asc") items.sort((a, b) => a.price - b.price);
  if (state.sort === "preco_desc") items.sort((a, b) => b.price - a.price);

  grid.innerHTML = items
    .map(
      (p) => `
    <div class="card">
      <img src="${FALLBACK_IMG[p.category] || FALLBACK_IMG.outros}" alt="${p.name}">
      <div class="body">
        <div>${p.name}</div>
        <div>${fmtBRL(p.price)} • ${p.unit}</div>
        <button class="add" data-id="${p.id}">Adicionar</button>
      </div>
    </div>`
    )
    .join("");

  grid.querySelectorAll(".add").forEach((btn) => {
    btn.onclick = () => addToCart(PRODUCTS.find((p) => p.id == btn.dataset.id));
  });
}

// ===== Carrinho =====
const cartDrawer = document.getElementById("cartDrawer");
const btnCart = document.getElementById("btnCart");
const closeCartBtn = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

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
  let total = 0,
    count = 0;
  state.cart.forEach((i) => {
    total += i.price * i.qty;
    count += i.qty;
    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${FALLBACK_IMG[i.category]}" width="40">
        <div>
          ${i.name}<br>
          <small>${fmtBRL(i.price)} • ${i.unit}</small>
        </div>
        <div>${i.qty}</div>
      </div>`;
  });
  if (state.cart.length === 0) {
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  }
  cartTotal.textContent = fmtBRL(total);
  cartCount.textContent = count;
}

// ===== Login =====
const adminModal = document.getElementById("adminModal");
document.getElementById("btnLogin").onclick = () =>
  adminModal.classList.add("open");
document.getElementById("cancelAdmin").onclick = () =>
  adminModal.classList.remove("open");
document.getElementById("submitAdmin").onclick = () => {
  alert("Login mockado: admin@dudoces.com / 123456");
  adminModal.classList.remove("open");
};

// ===== Chat =====
document.getElementById("toggleChat").onclick = () =>
  document.getElementById("chatEmbed").classList.toggle("open");

// ===== Inicialização =====
function init() {
  renderCatChips();
  renderBrands();
  renderProducts();
  renderCart();
}
init();
