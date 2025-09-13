// helpers
const $ = (s)=>document.querySelector(s);
const on = (el,ev,fn)=>el && el.addEventListener(ev,fn);

// === API base (auto: dev vs prod) ===
const API_BASE = (() => {
  const PROD = "https://du-doces-backend-production.up.railway.app"; // backend no Railway
  const DEV  = "http://localhost:8080";
  const h = location.hostname;
  // se estiver no Vercel (seu domínio) -> PROD; se localhost -> DEV; senão PROD
  return (h === "du-doces.vercel.app")
    ? PROD
    : (["localhost","127.0.0.1"].includes(h) ? DEV : PROD);
})();

// utils
const slug = (s) => String(s||"")
  .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,'');
const BRL = (v) => Number(v||0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

// state
let PRODUCTS = [];
let activeCat = 'tudo';
let activeBrand = null;
let otherBrandsSelected = new Set();

// elements
const grid = $('#productsGrid');
const sortSel = $('#sort');
const promoOnly = $('#promoOnly');
const btnClear = $('#btn-clear');

// ---- Layout dynamic mount ----
const CATS = [
  { key:'tudo',       label:'Tudo' },
  { key:'bebida',     label:'Bebida' },
  { key:'salgadinho', label:'Salgadinho' },
  { key:'chocolate',  label:'Chocolate' },
  { key:'utilidades', label:'Utilidades' },
];
const MAIN_BRANDS = ['Coca-Cola','Fanta','Nestle','Arcor','OZ','LA','BALY'];

function mountBars(){
  $('#catsBar').innerHTML = CATS.map((c,i)=>`
    <button class="chip ${i===0?'active':''}" data-cat="${c.key}">${c.label}</button>
  `).join('');
  $('#brandsBar').innerHTML = MAIN_BRANDS.map(b=>`
    <button class="chip chip-brand" data-brand="${slug(b)}">${b}</button>
  `).join('');
}

function mountOtherBrands(brandsJson){
  let list = ['Freegells','Garoto','Pipper','Chita','Haribo','Fini','Peccin','Dori','Riclan'];
  if (brandsJson){
    if (Array.isArray(brandsJson)) list = brandsJson;
    if (brandsJson.others) list = brandsJson.others;
  }
  $('#otherBrands').innerHTML = list.map(b=>`
    <button class="chip" data-other-brand="${slug(b)}">${b}</button>
  `).join('');
}

// ---- Render grid ----
function normalizeProduct(p){
  const brandName = p?.brand?.name ?? p?.brand ?? p?.marca ?? "";
  const catName   = p?.category?.name ?? p?.category ?? p?.categoria ?? p?.cat ?? "";
  const priceVal  = (p?.precoCentavos != null) ? (p.precoCentavos/100) : (p?.price ?? p?.preco ?? p?.valor ?? 0);
  const imgUrl    = p?.imageUrl ?? p?.image ?? p?.img ?? 'https://picsum.photos/seed/du-doces/600/400';
  return {
    id:    p?.id ?? p?.codigo ?? crypto.randomUUID(),
    name:  p?.name ?? p?.nome ?? p?.titulo ?? 'Produto',
    brand: String(brandName),
    brandKey: slug(brandName),
    cat:   slug(catName),
    price: Number(priceVal),
    promo: Boolean(p?.promo ?? p?.promocao ?? p?.em_promocao ?? false),
    img:   imgUrl
  };
}

function render(list){
  if(!list.length){
    grid.innerHTML = `<p style="opacity:.7">Nenhum produto encontrado.</p>`;
    return;
  }
  grid.innerHTML = list.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Produto'">
      <div class="p16">
        <div class="title">${p.name}</div>
        <div class="brand">${p.brand}</div>
        <div class="row">
          <strong>${BRL(p.price)}</strong>
          <button class="btn btn-outline" data-add="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ---- Filters ----
function applyFilters(){
  let list = [...PRODUCTS];

  if(activeCat !== 'tudo'){
    list = list.filter(p => (p.cat||'') === activeCat);
  }
  if(activeBrand){
    list = list.filter(p => p.brandKey === activeBrand);
  }
  if(otherBrandsSelected.size){
    list = list.filter(p => otherBrandsSelected.has(p.brandKey));
  }
  if(promoOnly.checked){
    list = list.filter(p => p.promo);
  }

  switch(sortSel.value){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: break;
  }
  render(list);
}

// ==== CARRINHO (localStorage) ====
const CART_KEY = "du_cart";
const Cart = {
  load() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartUI();
  },
  add(prod, qty = 1) {
    const items = Cart.load();
    const idx = items.findIndex((i) => i.id === prod.id);
    if (idx >= 0) items[idx].qty += qty;
    else items.push({
      id: prod.id,
      name: prod.name,
      price: Number(prod.price),
      image: prod.img,
      qty,
    });
    Cart.save(items);
  },
  remove(id) {
    Cart.save(Cart.load().filter((i) => i.id !== id));
  },
  setQty(id, qty) {
    const n = Math.max(1, Number(qty||1));
    const items = Cart.load();
    const it = items.find((i) => i.id === id);
    if (!it) return;
    it.qty = n;
    Cart.save(items);
  },
  clear() {
    Cart.save([]);
  },
  total() {
    return Cart.load().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return Cart.load().reduce((sum, i) => sum + i.qty, 0);
  },
};

// Drawer carrinho
const cartDrawer = $('#cartDrawer');
function openCart(){ cartDrawer?.classList.add('open'); }
function closeCart(){ cartDrawer?.classList.remove('open'); }

function updateCartUI() {
  const items = Cart.load();
  $('#cart-count').textContent = String(Cart.count());
  $('#cart-total').textContent = BRL(Cart.total());

  const wrap = $('#cart-items');
  if (!wrap) return;
  if (!items.length) {
    wrap.innerHTML = `<p style="opacity:.7">Seu carrinho está vazio.</p>`;
    return;
  }
  wrap.innerHTML = items.map(i => `
    <div class="cart-row">
      <img class="cart-thumb" src="${i.image}" alt="${i.name}" />
      <div class="cart-info">
        <div class="name">${i.name}</div>
        <div class="price">${BRL(i.price)} <small>× ${i.qty} = ${BRL(i.price*i.qty)}</small></div>
        <div class="qty">
          <button class="btn-ico dec" data-id="${i.id}">−</button>
          <input class="q" data-id="${i.id}" type="number" min="1" value="${i.qty}" />
          <button class="btn-ico inc" data-id="${i.id}">+</button>
        </div>
      </div>
      <button class="btn btn-light rm" data-id="${i.id}">Remover</button>
    </div>
  `).join('');
}

// ---- Events ----
document.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip');

  if(chip?.dataset.cat){
    document.querySelectorAll('#catsBar .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    activeCat = chip.dataset.cat;
    activeBrand = null;
    otherBrandsSelected.clear();
    document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
    applyFilters();
    return;
  }

  if(chip?.dataset.brand){
    document.querySelectorAll('#brandsBar .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    activeBrand = chip.dataset.brand; // slug
    activeCat = 'tudo';
    otherBrandsSelected.clear();
    document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
    applyFilters();
    return;
  }

  if(chip?.dataset.otherBrand){
    const key = chip.dataset.otherBrand;
    chip.classList.toggle('active');
    if(chip.classList.contains('active')) otherBrandsSelected.add(key);
    else otherBrandsSelected.delete(key);
    activeBrand = null;
    applyFilters();
    return;
  }

  if(e.target.matches('[data-add]')){
    const id = e.target.getAttribute('data-add');
    const prod = PRODUCTS.find(p => p.id === id);
    if (prod) {
      Cart.add(prod, 1);
      openCart();
    }
    return;
  }

  if (e.target.matches('#btn-cart')) { openCart(); return; }
  if (e.target.matches('#cart-close')) { closeCart(); return; }
  if (e.target.id === 'cartDrawer' && e.target.classList.contains('drawer')) { closeCart(); return; }

  if (e.target.matches('.rm')) {
    Cart.remove(e.target.dataset.id);
    return;
  }
  if (e.target.matches('.inc')) {
    const id = e.target.dataset.id;
    const items = Cart.load();
    const it = items.find(i=>i.id===id);
    Cart.setQty(id, (it?.qty||1) + 1);
    return;
  }
  if (e.target.matches('.dec')) {
    const id = e.target.dataset.id;
    const items = Cart.load();
    const it = items.find(i=>i.id===id);
    Cart.setQty(id, Math.max(1, (it?.qty||1) - 1));
    return;
  }
});

document.addEventListener('input', (e)=>{
  if(e.target === sortSel || e.target === promoOnly){
    applyFilters();
  }
  if (e.target.matches('.q')) {
    const id = e.target.dataset.id;
    const qty = Number(e.target.value||1);
    Cart.setQty(id, qty);
  }
});

on(btnClear,'click', ()=>{
  promoOnly.checked = false;
  sortSel.value = 'relevance';
  document.querySelectorAll('.chip.active').forEach(c=>c.classList.remove('active'));
  document.querySelector('[data-cat="tudo"]')?.classList.add('active');
  activeCat = 'tudo'; activeBrand = null; otherBrandsSelected.clear();
  document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
  applyFilters();
});

// Drawer & modais (menu)
on($('#btn-menu'),'click', ()=>$('#drawer').classList.add('open'));
on($('#close-drawer'),'click', ()=>$('#drawer').classList.remove('open'));
on($('#drawer'),'click', (e)=>{ if(e.target.id==='drawer') e.currentTarget.classList.remove('open'); });

// Modais
document.querySelectorAll('[data-open]').forEach(btn=>{
  on(btn,'click', ()=>{
    $('#drawer').classList.remove('open');
    $('#modal-'+btn.getAttribute('data-open'))?.classList.add('open');
  });
});
document.querySelectorAll('[data-close]').forEach(btn=>{
  on(btn,'click', ()=>btn.closest('.modal').classList.remove('open'));
});
document.querySelectorAll('.modal').forEach(m=>{
  on(m,'click', (e)=>{ if(e.target.classList.contains('modal')) m.classList.remove('open'); });
});

// IA (placeholder)
on($('#btn-ia'),'click', ()=>alert('IA: conectar ChatVolt aqui. 😉'));

// Modo escuro
function setTheme(mode){
  if(mode==='dark'){ document.body.classList.add('dark'); localStorage.setItem('theme','dark'); }
  else{ document.body.classList.remove('dark'); localStorage.setItem('theme','light'); }
}
on($('#toggle-dark'),'click', ()=> setTheme(document.body.classList.contains('dark')?'light':'dark'));
setTheme(localStorage.getItem('theme') || 'light');

// Banners
async function loadBanners(){
  try{
    const data = await fetch('./assets/banners.json').then(r=>r.json());
    const html = (data||[]).map(b=>{
      const src = typeof b === 'string' ? b : (b.src||'');
      const href = typeof b === 'object' && b.href ? b.href : null;
      const img = `<img src="${src}" loading="lazy" alt="banner">`;
      return `<div class="banner">${href ? `<a href="${href}">${img}</a>` : img}</div>`;
    }).join('');
    $('#banners').innerHTML = html;
  }catch{}
}

// Data
async function loadData(){
  try{
    const res = await fetch(`${API_BASE}/produtos`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items ?? data.data ?? []);
    PRODUCTS = (Array.isArray(items)?items:[]).map(normalizeProduct);

    const mainSet = new Set(MAIN_BRANDS.map(b=>slug(b)));
    const allBrands = [...new Set(PRODUCTS.map(p => p.brand).filter(Boolean))];
    const others = allBrands.filter(b => !mainSet.has(slug(b)));
    mountOtherBrands({ others });

  }catch{
    try{
      const [prods, brands] = await Promise.all([
        fetch('./assets/products.json').then(r=>r.json()),
        fetch('./assets/brands.json').then(r=>r.json()).catch(()=>null)
      ]);
      PRODUCTS = (Array.isArray(prods)?prods:[]).map(normalizeProduct);
      mountOtherBrands(brands);
    }catch{
      PRODUCTS = [
        { id:1, name:"Bala Hortelã", brand:"Arcor", cat:"bala", price:2.99, promo:true,  img:"https://picsum.photos/seed/bala/600/400" },
        { id:2, name:"Chocolate Ao Leite 90g", brand:"Nestle", cat:"chocolate", price:7.49, promo:false, img:"https://picsum.photos/seed/choc/600/400" },
        { id:3, name:"Refrigerante Lata 350ml", brand:"Coca-Cola", cat:"salgadinho", price:4.99, promo:true,  img:"https://picsum.photos/seed/coke/600/400" }
      ].map(normalizeProduct);
      mountOtherBrands(null);
    }
  }
  applyFilters();
}

// boot
document.addEventListener('DOMContentLoaded', ()=>{
  mountBars();
  loadBanners();
  updateCartUI();
  loadData();
});

// ações do drawer do carrinho
on($('#cart-clear'), 'click', ()=> Cart.clear());
on($('#cart-checkout'), 'click', ()=>{
  alert('Checkout básico entra na Semana 3 😉\nResumo: ' + Cart.count() + ' item(ns) — ' + $('#cart-total').textContent);
});
