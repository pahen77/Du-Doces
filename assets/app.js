// ==== Configurações e defaults ====
const DEFAULT_CATEGORIES = [
  { id: "todas",        label: "Todas" },
  { id: "balas",        label: "Balas" },
  { id: "chicletes",    label: "Chicletes" },
  { id: "chocolates",   label: "Chocolates" },
  { id: "bolachas",     label: "Bolacha/Biscoito" },
  { id: "salgadinhos",  label: "Salgadinhos" },
  { id: "outros",       label: "Outros" }
];

const PRIMARY_BRANDS = ["arcor","freegells","nestle","coca"]; // aparecem no topo
const DEFAULT_BRANDS = [
  { id: "todas", label: "Todas as Marcas", logo: "" },
  { id: "arcor", label: "Arcor", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Arcor_logo.png" },
  { id: "freegells", label: "Freegells", logo: "" },
  { id: "nestle", label: "Nestlé", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nestle_textlogo_blue.svg" },
  { id: "coca", label: "Coca-Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Coca-Cola_logo.svg" },
  { id: "trident", label: "Trident", logo: "" },
  { id: "santafe", label: "Santa Fe", logo: "" },
  { id: "dori", label: "Dori", logo: "" },
  { id: "soberana", label: "Soberana", logo: "" },
  { id: "primor", label: "Primor", logo: "" },
  { id: "chita", label: "Chita", logo: "" },
  { id: "ourolux", label: "Ourolux", logo: "" },
  { id: "lacta", label: "Lacta", logo: "" },
  { id: "garoto", label: "Garoto", logo: "" },
  { id: "copag", label: "Copag", logo: "" }
];

const DEFAULT_BANNERS = [
  { image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?q=80&w=1600&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop" }
];
// FALLBACK embutido: aparece mesmo sem servidor
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
async function loadProducts(){
  try{
    const r = await fetch("assets/products.json", { cache: "no-store" });
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    PRODUCTS = Array.isArray(data) && data.length ? data : DEFAULT_PRODUCTS;
  }catch(e){
    console.warn("products.json não carregou — usando DEFAULT_PRODUCTS", e);
    PRODUCTS = DEFAULT_PRODUCTS;
  }
}

// ==== Estado ====
let CATEGORIES = DEFAULT_CATEGORIES.slice();
let BRANDS = DEFAULT_BRANDS.slice();
let BANNERS = DEFAULT_BANNERS.slice();
let PRODUCTS = []; // via JSON

let state = {
  cat: "todas",
  brand: "todas",
  search: "",
  promoOnly: false,
  sort: "relevancia",
  cart: [],
  bannerIndex: 0,
  dark: false,
  priceMin: null,
  priceMax: null,
};

// ==== Seletores ====
const btnMenu = document.getElementById("btnMenu");
const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawerPanel = document.getElementById("drawerPanel");
const darkToggle = document.getElementById("darkToggle");

const bannerTrack = document.getElementById("bannerTrack");
const bannerDots = document.getElementById("bannerDots");

const brandRow = document.getElementById("brandRow");
const brandRowExtra = document.getElementById("brandRowExtra");
const otherBrands = document.getElementById("otherBrands");

const catRow = document.getElementById("catRow");
const sortSelect = document.getElementById("sortSelect");
const promoOnly = document.getElementById("promoOnly");
const searchInput = document.getElementById("searchInput");
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");
const clearFilters = document.getElementById("clearFilters");

const grid = document.getElementById("grid");
const resultsInfo = document.getElementById("resultsInfo");
const noResults = document.getElementById("noResults");

const btnCart = document.getElementById("btnCart");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartShipping = document.getElementById("cartShipping");
const cartGrand = document.getElementById("cartGrand");
const cartCount = document.getElementById("cartCount");
const cepInput = document.getElementById("cepInput");

const adminModal = document.getElementById("adminModal");
const btnLogin = document.getElementById("btnLogin");
const cancelAdmin = document.getElementById("cancelAdmin");
const submitAdmin = document.getElementById("submitAdmin");

const toggleChat = document.getElementById("toggleChat");
const chatEmbed = document.getElementById("chatEmbed");

// ==== Utils ====
const fmtBRL = (n)=> isFinite(n) ? n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—";
const maskCEP = (v)=> v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d)/,"$1-$2");

// frete estimado
function estimateShipping(cep){
  const digits = (cep||"").replace(/\D/g,"");
  if(digits.length<8) return null;
  const d2 = parseInt(digits.slice(0,2),10);
  let base = 19.9;
  if(d2<=19) base = 21.9; else if(d2<=59) base = 24.9; else base = 29.9;
  const items = state.cart.reduce((a,i)=>a+i.qty,0);
  const extra = Math.max(0, (items-3)) * 2.5;
  return +(base + extra).toFixed(2);
}

// persistência
function saveState(){
  localStorage.setItem("dd_cart", JSON.stringify(state.cart));
  localStorage.setItem("dd_cep", cepInput.value || "");
  localStorage.setItem("dd_dark", state.dark ? "1":"0");
}
function loadState(){
  try{
    const c = JSON.parse(localStorage.getItem("dd_cart")||"[]");
    if(Array.isArray(c)) state.cart = c;
    const cep = localStorage.getItem("dd_cep"); if(cep) cepInput.value = cep;
    state.dark = localStorage.getItem("dd_dark")==="1";
    document.body.classList.toggle("dark", state.dark);
  }catch(e){}
}

// ==== Loads JSON ====
async function loadProducts(){
  try{
    const r = await fetch("assets/products.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    PRODUCTS = Array.isArray(data) ? data : [];
  }catch(e){
    console.warn("products.json não carregou", e); PRODUCTS = [];
  }
}
async function loadBrands(){
  try{
    const r = await fetch("assets/brands.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    BRANDS = Array.isArray(data)&&data.length ? data : DEFAULT_BRANDS;
  }catch(e){
    console.warn("brands.json não carregou", e); BRANDS = DEFAULT_BRANDS;
  }
}
async function loadBanners(){
  try{
    const r = await fetch("assets/banners.json",{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const data = await r.json();
    BANNERS = Array.isArray(data)&&data.length ? data : DEFAULT_BANNERS;
  }catch(e){
    console.warn("banners.json não carregou", e); BANNERS = DEFAULT_BANNERS;
  }
}

// ==== Drawer / Dark ====
btnMenu?.addEventListener("click", ()=> drawer.classList.add("open"));
closeDrawer?.addEventListener("click", ()=> drawer.classList.remove("open"));
darkToggle?.addEventListener("change", ()=>{
  state.dark = darkToggle.checked;
  document.body.classList.toggle("dark", state.dark);
  saveState();
});
// swipe close
let startX=null;
drawerPanel?.addEventListener("touchstart",(e)=>{ startX = e.touches[0].clientX; },{passive:true});
drawerPanel?.addEventListener("touchmove",(e)=>{ if(startX==null) return; const dx=e.touches[0].clientX-startX; if(dx<-60){drawer.classList.remove("open"); startX=null;} },{passive:true});

// ==== Banners ====
let bannerTimer=null;
function renderBanners(){
  bannerTrack.innerHTML = BANNERS.map(b=>{
    const style = `style="background:url('${b.image}') center/cover"`;
    return b.href ? `<a class="banner" href="${b.href}" ${style}></a>` : `<div class="banner" ${style}></div>`;
  }).join("");
  bannerDots.innerHTML = BANNERS.map((_,i)=>`<button class="${i===state.bannerIndex?'active':''}"></button>`).join("");
  [...bannerDots.children].forEach((d,i)=> d.onclick=()=>{state.bannerIndex=i;updateBanner();restartBannerTimer();});
  updateBanner(); restartBannerTimer();
}
function updateBanner(){ if(!bannerTrack) return; bannerTrack.style.transform=`translateX(-${state.bannerIndex*100}%)`; [...bannerDots.children].forEach((d,i)=>d.classList.toggle("active", i===state.bannerIndex)); }
function nextBanner(){ state.bannerIndex=(state.bannerIndex+1)%BANNERS.length; updateBanner(); }
function restartBannerTimer(){ if(bannerTimer) clearInterval(bannerTimer); bannerTimer=setInterval(nextBanner,5000); }

// ==== Marcas (principais + extras) ====
function renderBrands(){
  const main = BRANDS.filter(b=> PRIMARY_BRANDS.includes(b.id) || b.id==="todas");
  const extra = BRANDS.filter(b=> !PRIMARY_BRANDS.includes(b.id) && b.id!=="todas");

  const mk = (b)=> {
    const el=document.createElement("button");
    el.className="brand-btn"+(state.brand===b.id?" active":"");
    el.innerHTML = b.logo ? `<img src="${b.logo}" alt="${b.label}"><strong>${b.id==="todas"?"Todas as Marcas":b.label}</strong>` : `<strong>${b.label}</strong>`;
    el.onclick=()=>{ state.brand=b.id; renderProducts(); renderBrands(); };
    return el;
  };

  brandRow.innerHTML=""; brandRowExtra.innerHTML="";
  main.forEach(b=> brandRow.appendChild(mk(b)));
  extra.forEach(b=> brandRowExtra.appendChild(mk(b)));
  // se nenhuma extra, esconde o details
  otherBrands.style.display = extra.length ? "block" : "none";
}

// ==== Categorias (fixas) ====
function renderCatChips(){
  catRow.innerHTML="";
  DEFAULT_CATEGORIES.forEach(c=>{
    const btn = document.createElement("button");
    btn.className="chip"+(state.cat===c.id?" active":"");
    btn.dataset.cat=c.id;
    btn.textContent = c.label;
    if(c.id==="chicletes") btn.innerHTML = `🍬 ${c.label}`;
    btn.onclick=()=>{ state.cat=c.id; renderProducts(); renderCatChips(); };
    catRow.appendChild(btn);
  });
}

// ==== Filtros ====
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

// ==== Produtos ====
function renderProducts(){
  const items = filteredProducts();
  resultsInfo.style.display="block";
  resultsInfo.textContent = `${items.length} produto(s) encontrados`;
  noResults.style.display = items.length ? "none" : "block";

  grid.innerHTML = items.map(p=>{
    const src = FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
    const brand = (p.brand||"").toUpperCase();
    const inCart = !!state.cart.find(i=>i.id===p.id);
    const stockBadge = (p.stock??0) > 0 ? ((p.stock<=10)?"Últimas unidades":"Em estoque") : "Sem estoque";
    return `
      <div class="card">
        <div class="badges">
          <span class="badge stock">${stockBadge}</span>
          ${p.promo ? `<span class="badge promo">PROMO</span>` : ""}
        </div>
        <div class="thumb"><img src="${src}" alt="${p.name}"></div>
        <div class="body">
          <div class="title">${p.name}</div>
          <div class="brand-tag">${brand} • ${p.unit}</div>
          <div class="price">
            ${p.promo&&p.oldPrice?`<s style="opacity:.6;margin-right:6px">${fmtBRL(p.oldPrice)}</s>`:""}
            ${fmtBRL(p.price)}
          </div>
          <button class="btn primary add ${inCart?'in-cart':''}" data-id="${p.id}">
            ${inCart ? "No carrinho ✓" : "Adicionar"}
          </button>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".add").forEach(btn=>{
    btn.onclick=()=> addToCart(PRODUCTS.find(p=>p.id==btn.dataset.id));
  });
}

// ==== Carrinho ====
btnCart.onclick = ()=> cartDrawer.classList.add("open");
closeCart.onclick = ()=> cartDrawer.classList.remove("open");

function addToCart(p){
  const f = state.cart.find(i=>i.id===p.id);
  if(f) f.qty++; else state.cart.push({...p, qty:1});
  saveState();
  renderCart(); renderProducts();
}
function changeQty(id, delta){
  const i = state.cart.findIndex(x=>x.id===id);
  if(i<0) return;
  const q = (state.cart[i].qty||0)+delta;
  if(q<=0) state.cart.splice(i,1); else state.cart[i].qty = q;
  saveState();
  renderCart(); renderProducts();
}
function renderCart(){
  cartList.innerHTML="";
  let total=0, count=0;

  if(!state.cart.length){
    cartList.innerHTML = `<div class="cart-empty">Seu carrinho está vazio</div>`;
  }else{
    state.cart.forEach(i=>{
      total += i.price*i.qty; count += i.qty;
      const src = FALLBACK_IMG[i.category] || FALLBACK_IMG.outros;
      cartList.innerHTML += `
        <div class="cart-item">
          <img src="${src}" alt="${i.name}">
          <div><div style="font-weight:800">${i.name}</div><small>${fmtBRL(i.price)} • ${i.unit}</small></div>
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
  cartGrand.textContent = ship ? fmtBRL(total+ship) : fmtBRL(total);
  cartCount.textContent = count;

  cartList.querySelectorAll(".qty-inc").forEach(b=> b.onclick=()=>changeQty(+b.dataset.id,+1));
  cartList.querySelectorAll(".qty-dec").forEach(b=> b.onclick=()=>changeQty(+b.dataset.id,-1));
}

// CEP + frete live
cepInput.addEventListener("input",(e)=>{
  const pos=e.target.selectionStart;
  e.target.value = maskCEP(e.target.value);
  saveState(); renderCart();
  try{ e.target.setSelectionRange(pos,pos);}catch(_){}
});

// ==== Login (mock) ====
btnLogin.onclick = ()=> adminModal.classList.add("open");
cancelAdmin.onclick = ()=> adminModal.classList.remove("open");
submitAdmin.onclick = ()=>{ alert("Login mockado: admin@dudoces.com • 123456"); adminModal.classList.remove("open"); };

// Chat
toggleChat.onclick = ()=> chatEmbed.classList.toggle("open");

// Controles
sortSelect.onchange = (e)=>{ state.sort=e.target.value; renderProducts(); };
promoOnly.onchange  = (e)=>{ state.promoOnly=e.target.checked; renderProducts(); };
searchInput.oninput = (e)=>{ state.search=e.target.value; renderProducts(); };
priceMin.oninput = ()=>{ const v=parseFloat(priceMin.value.replace(",",".")); state.priceMin=isNaN(v)?null:v; renderProducts(); };
priceMax.oninput = ()=>{ const v=parseFloat(priceMax.value.replace(",",".")); state.priceMax=isNaN(v)?null:v; renderProducts(); };
clearFilters.onclick = ()=>{
  state.brand="todas"; state.cat="todas"; state.search=""; state.promoOnly=false; state.priceMin=null; state.priceMax=null; sortSelect.value="relevancia";
  searchInput.value=""; priceMin.value=""; priceMax.value=""; promoOnly.checked=false;
  renderBrands(); renderCatChips(); renderProducts();
};

// ==== Init ====
async function init(){
  loadState();

  await Promise.all([ loadProducts(), loadBrands(), loadBanners() ]);

  // placeholders de preço (se houver produtos)
  const prices = PRODUCTS.map(p=>p.price);
  if(prices.length){
    priceMin.placeholder = Math.min(...prices).toFixed(2).replace('.',',');
    priceMax.placeholder = Math.max(...prices).toFixed(2).replace('.',',');
  }

  renderBrands();
  renderCatChips();
  renderProducts();
  renderCart();
  renderBanners();

  // frete inicial
  const ship = estimateShipping(cepInput.value);
  document.getElementById("shippingEstimate").textContent = "Frete: " + (ship? fmtBRL(ship) : "—");
}
init();
