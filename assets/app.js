/* DU DOCES – Frontend 2.3 (tema vermelho) */

/* =======================
   Defaults / Fallback Data
   ======================= */
const DEFAULT_CATEGORIES = [
  { id: "todas",       label: "Todas" },
  { id: "balas",       label: "Balas" },
  { id: "chicletes",   label: "Chicletes" },
  { id: "chocolates",  label: "Chocolates" },
  { id: "bolachas",    label: "Bolacha/Biscoito" },
  { id: "salgadinhos", label: "Salgadinhos" },
  { id: "outros",      label: "Outros" }
];

const PRIMARY_BRANDS = ["todas","arcor","freegells","nestle","coca"]; // linha principal
const DEFAULT_BRANDS = [
  { id: "todas",    label: "Todas as Marcas", logo: "" },
  { id: "arcor",    label: "Arcor",           logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Arcor_logo.png" },
  { id: "freegells",label: "Freegells",       logo: "" },
  { id: "nestle",   label: "Nestlé",          logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nestle_textlogo_blue.svg" },
  { id: "coca",     label: "Coca-Cola",       logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Coca-Cola_logo.svg" },
  { id: "trident",  label: "Trident",         logo: "" },
  { id: "santafe",  label: "Santa Fe",        logo: "" },
  { id: "dori",     label: "Dori",            logo: "" },
  { id: "soberana", label: "Soberana",        logo: "" },
  { id: "primor",   label: "Primor",          logo: "" },
  { id: "chita",    label: "Chita",           logo: "" },
  { id: "ourolux",  label: "Ourolux",         logo: "" },
  { id: "lacta",    label: "Lacta",           logo: "" },
  { id: "garoto",   label: "Garoto",          logo: "" },
  { id: "copag",    label: "Copag",           logo: "" }
];

const DEFAULT_BANNERS = [
  { image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop", href: "#" },
  { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?q=80&w=1600&auto=format&fit=crop" }
];

const DEFAULT_PRODUCTS = [
  { "id": 101, "name": "Bala Pipper Dura",              "brand": "santafe",  "category": "balas",       "price": 6.95,  "unit": "pacote",  "best": 30, "stock": 50 },
  { "id": 102, "name": "Bala Pipper Mastigável",         "brand": "santafe",  "category": "balas",       "price": 5.95,  "unit": "pacote",  "best": 28, "stock": 60, "promo": true, "oldPrice": 6.50 },
  { "id": 103, "name": "Bala de Mel",                    "brand": "dori",     "category": "balas",       "price": 8.99,  "unit": "pacote",  "best": 18, "stock": 40 },
  { "id": 104, "name": "Bala Gengibre e Mel",            "brand": "soberana", "category": "balas",       "price": 7.95,  "unit": "pacote",  "best": 14, "stock": 35 },
  { "id": 105, "name": "Bala de Mel",                    "brand": "arcor",    "category": "balas",       "price": 15.50, "unit": "pacote",  "best": 12, "stock": 25 },
  { "id": 106, "name": "Bala de Banana",                 "brand": "primor",   "category": "balas",       "price": 15.75, "unit": "pacote",  "best": 10, "stock": 20 },
  { "id": 107, "name": "Bala Chita Sortida",             "brand": "chita",    "category": "balas",       "price": 7.60,  "unit": "pacote",  "best": 16, "stock": 30 },
  { "id": 108, "name": "Lâmpada 9W",                     "brand": "ourolux",  "category": "outros",      "price": 2.99,  "unit": "unidade", "best": 6,  "stock": 100 },

  { "id": 109, "name": "Suflair unidade",                "brand": "nestle",   "category": "chocolates",  "price": 4.99,  "unit": "unidade", "best": 40, "stock": 80 },
  { "id": 110, "name": "Suflair caixa",                  "brand": "nestle",   "category": "chocolates",  "price": 99.50, "unit": "caixa",   "best": 15, "stock": 15 },
  { "id": 111, "name": "KitKat unidade",                 "brand": "nestle",   "category": "chocolates",  "price": 2.99,  "unit": "unidade", "best": 42, "stock": 120, "promo": true, "oldPrice": 3.49 },
  { "id": 112, "name": "KitKat caixa",                   "brand": "nestle",   "category": "chocolates",  "price": 71.75, "unit": "caixa",   "best": 22, "stock": 18 },
  { "id": 113, "name": "Chocolate Block unidade",        "brand": "arcor",    "category": "chocolates",  "price": 1.75,  "unit": "unidade", "best": 26, "stock": 150 },
  { "id": 114, "name": "Chocolate Block caixa",          "brand": "arcor",    "category": "chocolates",  "price": 32.50, "unit": "caixa",   "best": 20, "stock": 22 },
  { "id": 115, "name": "Sonho de Valsa pacote",          "brand": "lacta",    "category": "chocolates",  "price": 53.95, "unit": "pacote",  "best": 19, "stock": 25 },
  { "id": 116, "name": "Ouro Branco pacote",             "brand": "lacta",    "category": "chocolates",  "price": 53.95, "unit": "pacote",  "best": 18, "stock": 25 },
  { "id": 117, "name": "Serenata de Amor pacote",        "brand": "garoto",   "category": "chocolates",  "price": 49.95, "unit": "pacote",  "best": 15, "stock": 20 },
  { "id": 118, "name": "Bon o Bon pacote brigadeiro",    "brand": "arcor",    "category": "chocolates",  "price": 39.95, "unit": "pacote",  "best": 12, "stock": 18 },
  { "id": 119, "name": "Bon o Bon pacote morango",       "brand": "arcor",    "category": "chocolates",  "price": 39.95, "unit": "pacote",  "best": 12, "stock": 18 },
  { "id": 120, "name": "Bon o Bon pacote beijinho",      "brand": "arcor",    "category": "chocolates",  "price": 39.95, "unit": "pacote",  "best": 12, "stock": 18 },

  { "id": 121, "name": "Baralho Copag unidade",          "brand": "copag",    "category": "outros",      "price": 11.50, "unit": "unidade", "best": 9,  "stock": 50 },
  { "id": 122, "name": "Baralho Copag caixa",            "brand": "copag",    "category": "outros",      "price": 138.00,"unit": "caixa",   "best": 5,  "stock": 8 },

  { "id": 123, "name": "Trident caixa Menta",            "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 38, "stock": 30 },
  { "id": 124, "name": "Trident caixa Hortelã",          "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 34, "stock": 28 },
  { "id": 125, "name": "Trident caixa Tutti Frutti",     "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 33, "stock": 26 },
  { "id": 126, "name": "Trident caixa Blueberry",        "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 31, "stock": 24 },
  { "id": 127, "name": "Trident caixa Intense",          "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 30, "stock": 22 },
  { "id": 128, "name": "Trident caixa Cereja Ice",       "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 29, "stock": 22 },
  { "id": 129, "name": "Trident caixa Herbal",           "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 28, "stock": 22 },
  { "id": 130, "name": "Trident caixa Melancia",         "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 27, "stock": 22 },
  { "id": 131, "name": "Trident caixa Canela",           "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 26, "stock": 22 },
  { "id": 132, "name": "Trident caixa Morango",          "brand": "trident",  "category": "chicletes",   "price": 35.70, "unit": "caixa",   "best": 26, "stock": 22 },

  { "id": 133, "name": "Freegells Menthol pacote",       "brand": "freegells","category": "chicletes",   "price": 9.90,  "unit": "pacote",  "best": 20, "stock": 40, "promo": true, "oldPrice": 11.50 },

  { "id": 201, "name": "Biscoito Maizena 400g",          "brand": "nestle",   "category": "bolachas",    "price": 6.49,  "unit": "pacote",  "best": 21, "stock": 60 },
  { "id": 202, "name": "Biscoito Recheado Morango",      "brand": "nestle",   "category": "bolachas",    "price": 3.99,  "unit": "pacote",  "best": 24, "stock": 80 },
  { "id": 203, "name": "Biscoito Recheado Chocolate",    "brand": "arcor",    "category": "bolachas",    "price": 4.49,  "unit": "pacote",  "best": 22, "stock": 70 },
  { "id": 204, "name": "Wafer Chocolate 140g",           "brand": "nestle",   "category": "bolachas",    "price": 3.49,  "unit": "pacote",  "best": 19, "stock": 90 },

  { "id": 301, "name": "Salgadinho Queijo 45g",          "brand": "dori",     "category": "salgadinhos", "price": 4.29,  "unit": "unidade", "best": 25, "stock": 120 },
  { "id": 302, "name": "Salgadinho Churrasco 45g",       "brand": "dori",     "category": "salgadinhos", "price": 4.29,  "unit": "unidade", "best": 23, "stock": 110 },
  { "id": 303, "name": "Batata Lisa 90g",                "brand": "dori",     "category": "salgadinhos", "price": 7.99,  "unit": "unidade", "best": 18, "stock": 80 },

  { "id": 401, "name": "Coca-Cola Lata 350ml",           "brand": "coca",     "category": "outros",      "price": 4.50,  "unit": "unidade", "best": 50, "stock": 200, "promo": true, "oldPrice": 5.00 },
  { "id": 402, "name": "Coca-Cola Caixa c/12 latas",     "brand": "coca",     "category": "outros",      "price": 51.00, "unit": "caixa",   "best": 35, "stock": 25 }
];

const FALLBACK_IMG = {
  balas: "https://picsum.photos/800/800?random=11",
  chicletes: "https://picsum.photos/800/800?random=22",
  chocolates: "https://picsum.photos/800/800?random=33",
  bolachas: "https://picsum.photos/800/800?random=44",
  salgadinhos: "https://picsum.photos/800/800?random=55",
  outros: "https://picsum.photos/800/800?random=66",
};

/* =======================
   Estado
   ======================= */
let CATEGORIES = DEFAULT_CATEGORIES.slice();
let BRANDS = DEFAULT_BRANDS.slice();
let BANNERS = DEFAULT_BANNERS.slice();
let PRODUCTS = [];

let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  promoOnly: false,
  sort: "relevancia",
  cart: [],
  bannerIndex: 0,
  dark: false,
  minPrice: null,
  maxPrice: null
};

/* =======================
   Seletores
   ======================= */
const btnMenu = document.getElementById("btnMenu");
const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");
const toggleDark = document.getElementById("toggleDark");

const bannerTrack = document.getElementById("bannerTrack");
const bannerDots = document.getElementById("bannerDots");

const brandRow = document.getElementById("brandRow");
const otherBrandsWrap = document.getElementById("otherBrands");

const catRow = document.getElementById("catRow");
const sortSelect = document.getElementById("sortSelect");
const promoOnly = document.getElementById("promoOnly");
const searchInput = document.getElementById("searchInput");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const clearFilters = document.getElementById("clearFilters");

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
const emailEl = document.getElementById("email");
const senhaEl = document.getElementById("senha");

const toggleChat = document.getElementById("toggleChat");
const chatEmbed = document.getElementById("chatEmbed");

/* =======================
   Utils
   ======================= */
const fmtBRL = (n) => isFinite(n) ? n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
const maskCEP = (v)=> v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2");

// Frete estimado (mock por faixa de CEP + quantidade de itens)
function estimateShipping(cep){
  const digits = (cep||"").replace(/\D/g,"");
  if(digits.length<8) return null;
  const d2 = parseInt(digits.slice(0,2),10);
  let base = 19.9;
  if(d2<=19) base = 21.9; else if(d2<=59) base = 24.9; else base = 29.9;
  const qty = state.cart.reduce((a,i)=>a+i.qty,0);
  const extra = Math.max(0, qty-3) * 2.5;
  return +(base + extra).toFixed(2);
}

// Persistência simples
function saveState(){
  localStorage.setItem("dd_cart", JSON.stringify(state.cart));
  localStorage.setItem("dd_cep", cepInput.value || "");
  localStorage.setItem("dd_dark", state.dark ? "1":"0");
}
function loadState(){
  try{
    const c = JSON.parse(localStorage.getItem("dd_cart") || "[]");
    if(Array.isArray(c)) state.cart = c;
    const cep = localStorage.getItem("dd_cep"); if(cep) cepInput.value = cep;
    state.dark = localStorage.getItem("dd_dark")==="1";
    document.body.classList.toggle("dark", state.dark);
  }catch(e){}
}

/* =======================
   Loads de JSON (com fallback)
   ======================= */
async function loadProducts(){
  try{
    const r = await fetch("assets/products.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    PRODUCTS = Array.isArray(data) && data.length ? data : DEFAULT_PRODUCTS;
  }catch(e){
    console.warn("products.json não carregou — usando DEFAULT_PRODUCTS", e);
    PRODUCTS = DEFAULT_PRODUCTS;
  }
}
async function loadBrands(){
  try{
    const r = await fetch("assets/brands.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    BRANDS = Array.isArray(data) && data.length ? data : DEFAULT_BRANDS;
  }catch(e){
    console.warn("brands.json não carregou — usando DEFAULT_BRANDS", e);
    BRANDS = DEFAULT_BRANDS;
  }
}
async function loadBanners(){
  try{
    const r = await fetch("assets/banners.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    BANNERS = Array.isArray(data) && data.length ? data : DEFAULT_BANNERS;
  }catch(e){
    console.warn("banners.json não carregou — usando DEFAULT_BANNERS", e);
    BANNERS = DEFAULT_BANNERS;
  }
}

/* =======================
   Drawer + Dark mode
   ======================= */
btnMenu?.addEventListener("click", ()=> drawer.classList.add("open"));
closeDrawer?.addEventListener("click", ()=> drawer.classList.remove("open"));
toggleDark?.addEventListener("click",(e)=>{
  e.preventDefault();
  state.dark = !state.dark;
  document.body.classList.toggle("dark", state.dark);
  saveState();
});

/* =======================
   Banners
   ======================= */
let bannerTimer=null;
function renderBanners(){
  bannerTrack.innerHTML = BANNERS.map(b=>{
    const style = `style="background:url('${b.image}') center/cover"`;
    return b.href ? `<a class="banner" href="${b.href}" ${style}></a>` : `<div class="banner" ${style}></div>`;
  }).join("");
  bannerDots.innerHTML = BANNERS.map((_,i)=>`<button class="${i===state.bannerIndex?'active':''}"></button>`).join("");
  [...bannerDots.children].forEach((d,i)=> d.onclick = ()=>{ state.bannerIndex=i; updateBanner(); restartBannerTimer(); });
  updateBanner(); restartBannerTimer();
}
function updateBanner(){
  if(!bannerTrack) return;
  bannerTrack.style.transform = `translateX(-${state.bannerIndex*100}%)`;
  [...bannerDots.children].forEach((d,i)=> d.classList.toggle("active", i===state.bannerIndex));
}
function nextBanner(){ state.bannerIndex=(state.bannerIndex+1)%BANNERS.length; updateBanner(); }
function restartBannerTimer(){ if(bannerTimer) clearInterval(bannerTimer); bannerTimer=setInterval(nextBanner,5000); }

/* =======================
   Marcas (principais + outras)
   ======================= */
function makeBrandButton(b){
  const el = document.createElement("div");
  el.className = "brand-logo" + (state.brand===b.id?" active":"");
  el.innerHTML = b.logo
    ? `<img src="${b.logo}" alt="${b.label}" style="height:20px;vertical-align:middle;margin-right:8px"> ${b.id==="todas"?"Todas as Marcas":b.label}`
    : (b.id==="todas"?"Todas as Marcas":b.label);
  el.onclick = ()=>{ state.brand=b.id; renderProducts(); renderBrands(); };
  return el;
}
function renderBrands(){
  const main = BRANDS.filter(b=> PRIMARY_BRANDS.includes(b.id));
  const extras = BRANDS.filter(b=> !PRIMARY_BRANDS.includes(b.id));

  brandRow.innerHTML = "";
  main.forEach(b=> brandRow.appendChild(makeBrandButton(b)));

  otherBrandsWrap.innerHTML = "";
  extras.forEach(b=> otherBrandsWrap.appendChild(makeBrandButton(b)));
}

/* =======================
   Categorias fixas (chips)
   ======================= */
function renderCatChips(){
  catRow.innerHTML = "";
  DEFAULT_CATEGORIES.forEach(c=>{
    const btn = document.createElement("button");
    btn.className = "chip" + (state.cat===c.id ? " active":"");
    btn.dataset.cat = c.id;
    btn.textContent = c.label;
    if(c.id==="chicletes") btn.textContent = `🍬 ${c.label}`;
    btn.onclick = ()=> { state.cat=c.id; renderProducts(); renderCatChips(); };
    catRow.appendChild(btn);
  });
}

/* =======================
   Filtros / Busca / Ordenação
   ======================= */
function inPriceRange(p){
  const min = state.minPrice!=null ? state.minPrice : -Infinity;
  const max = state.maxPrice!=null ? state.maxPrice : Infinity;
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
  // relevância simples: best desc, promo primeiro
  if(state.sort==="relevancia") items.sort((a,b)=>((b.promo?1:0)-(a.promo?1:0)) || (b.best||0)-(a.best||0));
  return items;
}

/* =======================
   Produtos (grid)
   ======================= */
function renderProducts(){
  const items = filteredProducts();
  if(!items.length){
    grid.innerHTML = `<div style="text-align:center;opacity:.75;padding:24px">Nenhum produto encontrado.</div>`;
    return;
  }

  grid.innerHTML = items.map(p=>{
    const src = FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
    const inCart = !!state.cart.find(i=>i.id===p.id);
    const brandTag = (p.brand || "").toUpperCase();
    const stockBadge = (p.stock??0)>0 ? ((p.stock<=10)?"Últimas unidades":"Em estoque") : "Sem estoque";

    return `
      <div class="card">
        <img src="${src}" alt="${p.name}">
        <div class="body">
          <div style="font-weight:800">${p.name}</div>
          <small class="brand-tag">${brandTag} • ${p.unit}</small>
          <div class="price">
            ${p.promo && p.oldPrice ? `<s style="opacity:.6;margin-right:6px">${fmtBRL(p.oldPrice)}</s>`:""}
            ${fmtBRL(p.price)}
          </div>
          <button class="add" data-id="${p.id}">${inCart?"No carrinho ✓":"Adicionar"}</button>
          <div style="font-size:11px;opacity:.75;margin-top:4px">${stockBadge}</div>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".add").forEach(btn=>{
    btn.onclick = ()=> addToCart(PRODUCTS.find(p=>p.id==btn.dataset.id));
  });
}

/* =======================
   Carrinho
   ======================= */
btnCart.onclick = ()=> cartDrawer.classList.add("open");
closeCart.onclick = ()=> cartDrawer.classList.remove("open");

function addToCart(p){
  const found = state.cart.find(i=>i.id===p.id);
  if(found) found.qty++;
  else state.cart.push({...p, qty:1});
  saveState();
  renderCart();
  renderProducts(); // atualiza botão para "No carrinho"
}

function changeQty(id, delta){
  const idx = state.cart.findIndex(i=>i.id===id);
  if(idx<0) return;
  const q = (state.cart[idx].qty||0) + delta;
  if(q<=0) state.cart.splice(idx,1);
  else state.cart[idx].qty = q;
  saveState();
  renderCart();
  renderProducts();
}

function renderCart(){
  cartList.innerHTML = "";
  let total = 0, count = 0;

  if(!state.cart.length){
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  }else{
    state.cart.forEach(i=>{
      total += i.price * i.qty;
      count += i.qty;
      const src = FALLBACK_IMG[i.category] || FALLBACK_IMG.outros;
      cartList.innerHTML += `
        <div class="cart-item">
          <img src="${src}" alt="${i.name}" width="40" height="40">
          <div style="flex:1">
            <div style="font-weight:700">${i.name}</div>
            <small>${fmtBRL(i.price)} • ${i.unit}</small>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <button class="btn secondary" data-dec="${i.id}">-</button>
            <strong>${i.qty}</strong>
            <button class="btn primary" data-inc="${i.id}">+</button>
          </div>
        </div>`;
    });
  }

  cartCount.textContent = count;
  const ship = estimateShipping(cepInput.value);
  cartTotal.textContent = fmtBRL(total + (ship||0));
  cartFrete.textContent = ship ? fmtBRL(ship) : "--";

  // eventos qty
  cartList.querySelectorAll("[data-inc]").forEach(b=> b.onclick=()=> changeQty(+b.dataset.inc, +1));
  cartList.querySelectorAll("[data-dec]").forEach(b=> b.onclick=()=> changeQty(+b.dataset.dec, -1));
}

/* CEP + frete live */
cepInput.addEventListener("input",(e)=>{
  const pos = e.target.selectionStart;
  e.target.value = maskCEP(e.target.value);
  saveState();
  renderCart();
  try{ e.target.setSelectionRange(pos,pos);}catch(_){}
});

/* =======================
   Login (mock)
   ======================= */
btnLogin.onclick = ()=> adminModal.classList.add("open");
cancelAdmin.onclick = ()=> adminModal.classList.remove("open");
submitAdmin.onclick = ()=>{
  // mock de credencial
  const ok = (emailEl.value||"").includes("@") && (senhaEl.value||"").length>=4;
  alert(ok ? "Login mockado: admin@dudoces.com • 123456" : "Credenciais inválidas");
  if(ok) adminModal.classList.remove("open");
};

/* =======================
   Chat
   ======================= */
toggleChat.onclick = ()=> chatEmbed.classList.toggle("open");

/* =======================
   Controles de filtro
   ======================= */
sortSelect.onchange = (e)=>{ state.sort = e.target.value; renderProducts(); };
promoOnly.onchange  = (e)=>{ state.promoOnly = e.target.checked; renderProducts(); };
searchInput.oninput = (e)=>{ state.search = e.target.value; renderProducts(); };
minPrice.oninput = ()=>{ const v = parseFloat(minPrice.value.replace(",", ".")); state.minPrice = isNaN(v)?null:v; renderProducts(); };
maxPrice.oninput = ()=>{ const v = parseFloat(maxPrice.value.replace(",", ".")); state.maxPrice = isNaN(v)?null:v; renderProducts(); };
clearFilters.onclick = ()=>{
  state.brand="todas"; state.cat="todas"; state.search=""; state.promoOnly=false; state.minPrice=null; state.maxPrice=null; sortSelect.value="relevancia";
  searchInput.value=""; minPrice.value=""; maxPrice.value=""; promoOnly.checked=false;
  renderBrands(); renderCatChips(); renderProducts();
};

/* =======================
   Init
   ======================= */
async function init(){
  loadState();

  await Promise.all([ loadProducts(), loadBrands(), loadBanners() ]);

  renderBrands();
  renderCatChips();
  renderProducts();
  renderCart();
  renderBanners();
}
init();
