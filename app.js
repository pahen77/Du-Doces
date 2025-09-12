// ===== Base 2.2 + v2.3 features + JSONs =====

// ----- Dados base / DEFAULTS (fallback se JSON não carregar) -----
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

// ----- Estados globais -----
let CATEGORIES = DEFAULT_CATEGORIES.slice();
let BRANDS = DEFAULT_BRANDS.slice();
let BANNERS = DEFAULT_BANNERS.slice();

let PRODUCTS = []; // carregado do JSON
const DEFAULT_PRODUCTS = []; // pode manter vazio; fallback mínimo

let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  cart: [],
  favorites: new Set(),
  sort: "relevancia",
  promoOnly: false,
  priceMin: null,
  priceMax: null,
  bannerIndex: 0,
  dark: false,
};

// ----- Seletores -----
const grid = document.getElementById("grid");
const brandRow = document.getElementById("brandRow");
const catRow = document.getElementById("catRow");
const sortSelect = document.getElementById("sortSelect");
const promoOnly = document.getElementById("promoOnly");
const searchInput = document.getElementById("searchInput");
const cepInput = document.getElementById("cepInput");
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");
const clearFilters = document.getElementById("clearFilters");

const cartDrawer = document.getElementById("cartDrawer");
const btnCart = document.getElementById("btnCart");
const closeCartBtn = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartShipping = document.getElementById("cartShipping");
const cartGrand = document.getElementById("cartGrand");
const cartCount = document.getElementById("cartCount");

const btnDrawer = document.getElementById("btnDrawer");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerPanel = document.getElementById("drawerPanel");
const darkToggle = document.getElementById("darkToggle");

const bannerTrack = document.getElementById("bannerTrack");
const bannerDots = document.getElementById("bannerDots");

const resultsInfo = document.getElementById("resultsInfo");
const noResults = document.getElementById("noResults");

const miniCart = document.getElementById("miniCart");
const miniTotal = document.getElementById("miniTotal");
const miniOpenCart = document.getElementById("miniOpenCart");

// ----- Utils -----
const fmtBRL = (n) => (isFinite(n) ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—");
function maskCEP(v){ return v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2"); }

// Frete estimado (mock por faixa de CEP + quantidade)
function estimateShipping(cep){
  const digits = (cep||"").replace(/\D/g,"");
  if(digits.length<8) return null;
  const d2 = parseInt(digits.slice(0,2),10);
  let base = 19.90;
  if(d2<=19) base = 21.90;
  else if(d2<=59) base = 24.90;
  else base = 29.90;
  const items = state.cart.reduce((a,i)=>a+i.qty,0);
  const extra = Math.max(0, (items-3)) * 2.5;
  return +(base + extra).toFixed(2);
}

// Persistência
function saveState(){
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("favorites", JSON.stringify([...state.favorites]));
  localStorage.setItem("cep", cepInput.value || "");
  localStorage.setItem("dark", state.dark ? "1":"0");
}
function loadState(){
  try{
    const c = JSON.parse(localStorage.getItem("cart")||"[]");
    if(Array.isArray(c)) state.cart = c;
    const f = JSON.parse(localStorage.getItem("favorites")||"[]");
    state.favorites = new Set(f);
    const cep = localStorage.getItem("cep"); if(cep) cepInput.value = cep;
    state.dark = localStorage.getItem("dark")==="1";
    document.body.classList.toggle("dark", state.dark);
    if(darkToggle) darkToggle.checked = state.dark;
  }catch(e){}
}

// ----- Loads (JSONs) -----
async function loadProductsFromJSON() {
  try {
    const res = await fetch("assets/products.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP "+res.status);
    const data = await res.json();
    PRODUCTS = (Array.isArray(data) && data.length) ? data : DEFAULT_PRODUCTS;
  } catch (e) {
    console.warn("Falha ao carregar products.json, usando fallback.", e);
    PRODUCTS = DEFAULT_PRODUCTS;
  }
}
async function loadBrandsFromJSON() {
  try {
    const res = await fetch("assets/brands.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP "+res.status);
    const data = await res.json();
    BRANDS = (Array.isArray(data) && data.length) ? data : DEFAULT_BRANDS;
  } catch (e) {
    console.warn("Falha ao carregar brands.json, usando fallback.", e);
    BRANDS = DEFAULT_BRANDS;
  }
}
async function loadBannersFromJSON() {
  try {
    const res = await fetch("assets/banners.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP "+res.status);
    const data = await res.json();
    BANNERS = (Array.isArray(data) && data.length) ? data : DEFAULT_BANNERS;
  } catch (e) {
    console.warn("Falha ao carregar banners.json, usando fallback.", e);
    BANNERS = DEFAULT_BANNERS;
  }
}

// ----- UI: Marcas / Categorias -----
const CATEGORIES = DEFAULT_CATEGORIES; // categorias fixas por enquanto

function renderBrands() {
  brandRow.innerHTML = "";
  BRANDS.forEach((b) => {
    const btn = document.createElement("button");
    btn.className = "brand-btn" + (state.brand === b.id ? " active" : "");
    btn.innerHTML = b.logo
      ? `<img src="${b.logo}" alt="${b.label}"><strong>${b.id === "todas" ? "Todas as Marcas" : b.label}</strong>`
      : `<strong>${b.label}</strong>`;
    btn.onclick = () => { state.brand = b.id; withSkeleton(renderProducts); renderBrands(); };
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
    btn.onclick = () => { state.cat = c.id; withSkeleton(renderProducts); renderCatChips(); };
    catRow.appendChild(btn);
  });
}

// ----- Filtros / Ordenação -----
function inPriceRange(p){
  const min = state.priceMin!=null ? state.priceMin : -Infinity;
  const max = state.priceMax!=null ? state.priceMax : Infinity;
  return p.price >= min && p.price <= max;
}
function filteredProducts(){
  let items = PRODUCTS.filter(p =>
    (state.cat==="todas" || p.category===state.cat) &&
    (state.brand==="todas" || p.brand===state.brand) &&
    (!state.promoOnly || p.promo) &&
    inPriceRange(p) &&
    p.name.toLowerCase().includes(state.search.toLowerCase())
  );
  if(state.sort==="preco_asc") items.sort((a,b)=>a.price-b.price);
  if(state.sort==="preco_desc") items.sort((a,b)=>b.price-a.price);
  if(state.sort==="best") items.sort((a,b)=>(b.best||0)-(a.best||0));
  return items;
}

// ----- Skeleton -----
function skeletonCards(qty=8){
  grid.innerHTML = Array.from({length:qty}).map(()=>`
    <div class="card skeleton">
      <div class="thumb skel"></div>
      <div class="body">
        <div class="skel line-lg"></div>
        <div class="skel"></div>
        <div class="skel"></div>
      </div>
    </div>
  `).join("");
}
function withSkeleton(cb){
  skeletonCards();
  setTimeout(()=>cb(), 200);
}

// ----- Render: Produtos (agrupado por categoria) -----
const FALLBACK_IMG = {
  balas: "https://picsum.photos/800/800?random=11",
  chicletes: "https://picsum.photos/800/800?random=22",
  chocolates: "https://picsum.photos/800/800?random=33",
  outros: "https://picsum.photos/800/800?random=44",
};

function renderProducts(){
  const items = filteredProducts();
  resultsInfo.style.display = "block";
  resultsInfo.textContent = `${items.length} produto(s) encontrados`;
  noResults.style.display = items.length ? "none" : "block";

  const grouped = {};
  items.forEach(p => {
    const k = state.cat==="todas" ? p.category : "single";
    grouped[k] ||= [];
    grouped[k].push(p);
  });

  const renderCard = (p) => {
    const src = FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
    const brandName = (p.brand || "").toUpperCase();
    const inCart = !!state.cart.find(i=>i.id===p.id);
    const fav = state.favorites.has(p.id);
    const stockBadge = (p.stock??0) > 0 ? (p.stock<=10 ? "Últimas unidades" : "Em estoque") : "Sem estoque";
    return `
      <div class="card">
        <div class="badges">
          <span class="badge stock">${stockBadge}</span>
          ${p.promo ? `<span class="badge promo">PROMO</span>` : ""}
        </div>
        <button class="fav ${fav?'active':''}" data-fav="${p.id}" title="Favoritar">${fav ? "❤️":"🤍"}</button>
        <div class="thumb"><img src="${src}" alt="${p.name}"></div>
        <div class="body">
          <div class="title">${p.name}</div>
          <div class="brand-tag">${brandName} • ${p.unit}</div>
          <div class="price">
            ${p.promo && p.oldPrice ? `<s style="opacity:.6;margin-right:6px">${fmtBRL(p.oldPrice)}</s>`:""}
            ${fmtBRL(p.price)}
          </div>
          <button class="btn primary add ${inCart?'in-cart':''}" data-id="${p.id}">
            ${inCart ? "No carrinho ✓" : "Adicionar"}
          </button>
        </div>
      </div>
    `;
  };

  let html = "";
  const catOrder = ["balas","chicletes","chocolates","outros"];
  (state.cat==="todas" ? catOrder.filter(c=>grouped[c]) : ["single"]).forEach(section=>{
    if(section!=="single"){
      const label = CATEGORIES.find(c=>c.id===section)?.label || section;
      html += `<h3 class="section-title">${label}</h3>`;
    }
    (grouped[section]||[]).forEach(p=> html += renderCard(p));
  });

  grid.innerHTML = html;

  grid.querySelectorAll(".add").forEach(btn=>{
    btn.onclick = () => addToCart(PRODUCTS.find(p=>p.id==btn.dataset.id));
  });
  grid.querySelectorAll(".fav").forEach(btn=>{
    btn.onclick = () => toggleFav(+btn.dataset.fav);
  });
}

// ----- Favoritos -----
function toggleFav(id){
  if(state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  saveState();
  renderProducts();
}

// ----- Carrinho -----
btnCart.onclick = () => cartDrawer.classList.add("open");
miniOpenCart.onclick = () => cartDrawer.classList.add("open");
closeCartBtn.onclick = () => cartDrawer.classList.remove("open");

function addToCart(p){
  const found = state.cart.find(i=>i.id===p.id);
  if(found) found.qty++;
  else state.cart.push({...p, qty:1});
  saveState();
  renderCart();
  renderProducts();
}

function changeQty(id, delta){
  const i = state.cart.findIndex(x=>x.id===id);
  if(i<0) return;
  const q = (state.cart[i].qty||0) + delta;
  if(q<=0) state.cart.splice(i,1);
  else state.cart[i].qty = q;
  saveState();
  renderCart();
  renderProducts();
}

function renderCart(){
  cartList.innerHTML = "";
  let total=0, count=0;

  if(state.cart.length===0){
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  } else {
    state.cart.forEach(i=>{
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
  cartShipping.textContent = ship ? fmtBRL(ship) : "—";
  cartGrand.textContent = ship ? fmtBRL(total + ship) : fmtBRL(total);
  cartCount.textContent = count;
  miniTotal.textContent = cartGrand.textContent;

  cartList.querySelectorAll(".qty-inc").forEach(b=> b.onclick = ()=> changeQty(+b.dataset.id, +1));
  cartList.querySelectorAll(".qty-dec").forEach(b=> b.onclick = ()=> changeQty(+b.dataset.id, -1));
}

// ----- Banners (dinâmicos via JSON) -----
let bannerTimer=null;
function renderBanners(){
  // cria slides com base em BANNERS
  bannerTrack.innerHTML = BANNERS.map(b=>{
    const style = `style="background:url('${b.image}') center/cover"`;
    return b.href
      ? `<a class="banner" href="${b.href}" ${style}></a>`
      : `<div class="banner" ${style}></div>`;
  }).join("");
  renderBannerDots();
  updateBanner();
  restartBannerTimer();
}
function renderBannerDots(){
  bannerDots.innerHTML="";
  for(let i=0;i<BANNERS.length;i++){
    const b=document.createElement("button");
    b.className = i===state.bannerIndex ? "active":"";
    b.onclick = ()=>{ state.bannerIndex=i; updateBanner(); restartBannerTimer(); };
    bannerDots.appendChild(b);
  }
}
function updateBanner(){
  if(!bannerTrack || BANNERS.length===0) return;
  bannerTrack.style.transform = `translateX(-${state.bannerIndex*100}%)`;
  [...bannerDots.children].forEach((d,idx)=> d.classList.toggle("active", idx===state.bannerIndex));
}
function nextBanner(){ state.bannerIndex = (state.bannerIndex+1)%BANNERS.length; updateBanner(); }
function restartBannerTimer(){ if(bannerTimer) clearInterval(bannerTimer); bannerTimer = setInterval(nextBanner, 5000); }

// ----- Menu + Swipe close -----
btnDrawer?.addEventListener("click", ()=> drawer.classList.add("open"));
drawerBackdrop?.addEventListener("click", ()=> drawer.classList.remove("open"));
let startX=null;
drawerPanel?.addEventListener("touchstart",(e)=>{ startX = e.touches[0].clientX; },{passive:true});
drawerPanel?.addEventListener("touchmove",(e)=>{
  if(startX==null) return;
  const dx = e.touches[0].clientX - startX;
  if(dx < -60){ drawer.classList.remove("open"); startX=null; }
},{passive:true});

// ----- Login -----
const adminModal = document.getElementById("adminModal");
document.getElementById("btnLogin").onclick = ()=> adminModal.classList.add("open");
document.getElementById("cancelAdmin").onclick = ()=> adminModal.classList.remove("open");
document.getElementById("submitAdmin").onclick = ()=>{
  alert("Login mockado: admin@dudoces.com • senha: 123456");
  adminModal.classList.remove("open");
};

// ----- Chat -----
document.getElementById("toggleChat").onclick = ()=> document.getElementById("chatEmbed").classList.toggle("open");

// ----- Controles -----
sortSelect.onchange = (e)=>{ state.sort=e.target.value; withSkeleton(renderProducts); };
promoOnly.onchange = (e)=>{ state.promoOnly=e.target.checked; withSkeleton(renderProducts); };
searchInput.oninput = (e)=>{ state.search=e.target.value; withSkeleton(renderProducts); };

priceMin.oninput = ()=>{
  const v = parseFloat(priceMin.value.replace(",","."));
  state.priceMin = isNaN(v) ? null : v;
  withSkeleton(renderProducts);
};
priceMax.oninput = ()=>{
  const v = parseFloat(priceMax.value.replace(",","."));
  state.priceMax = isNaN(v) ? null : v;
  withSkeleton(renderProducts);
};
clearFilters.onclick = ()=>{
  state.brand="todas"; state.cat="todas"; state.search=""; state.promoOnly=false;
  state.priceMin=null; state.priceMax=null; sortSelect.value="relevancia";
  document.getElementById("searchInput").value="";
  priceMin.value=""; priceMax.value="";
  document.getElementById("promoOnly").checked=false;
  renderBrands(); renderCatChips(); withSkeleton(renderProducts);
};

// CEP mask + frete live
cepInput.addEventListener("input", (e)=>{
  const pos = e.target.selectionStart;
  e.target.value = maskCEP(e.target.value);
  saveState();
  const ship = estimateShipping(e.target.value);
  document.getElementById("shippingEstimate").textContent = "Frete: " + (ship? fmtBRL(ship) : "—");
  renderCart();
  try{ e.target.setSelectionRange(pos,pos);}catch(_){}
});

// Dark Mode
darkToggle.onchange = ()=>{
  state.dark = darkToggle.checked;
  document.body.classList.toggle("dark", state.dark);
  saveState();
};

// Mini-cart
miniOpenCart.onclick = ()=> cartDrawer.classList.add("open");

// ----- Inicialização -----
async function init(){
  loadState();

  // carrega JSONs (com fallback)
  await Promise.all([
    loadProductsFromJSON(),
    loadBrandsFromJSON(),
    loadBannersFromJSON(),
  ]);

  renderBrands();
  renderCatChips();

  // placeholders de preço
  const base = PRODUCTS.length ? PRODUCTS : DEFAULT_PRODUCTS;
  const prices = base.map(p=>p.price);
  if (prices.length) {
    const min = Math.min(...prices), max = Math.max(...prices);
    priceMin.placeholder = min.toFixed(2).replace('.',',');
    priceMax.placeholder = max.toFixed(2).replace('.',',');
  }

  withSkeleton(renderProducts);
  renderCart();

  renderBanners(); // agora banners via JSON

  // Frete inicial
  const ship = estimateShipping(cepInput.value);
  document.getElementById("shippingEstimate").textContent = "Frete: " + (ship? fmtBRL(ship) : "—");
}
init();
