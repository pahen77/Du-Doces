// helpers
const $ = (s)=>document.querySelector(s);
const on = (el,ev,fn)=>el && el.addEventListener(ev,fn);

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
  { key:'tudo', label:'Tudo' },
  { key:'chiclete', label:'Chiclete' },
  { key:'bala', label:'Bala' },
  { key:'chocolate', label:'Chocolate' },
  { key:'bolacha', label:'Bolacha/Biscoito' },
  { key:'salgadinho', label:'Salgadinho' },
];

const MAIN_BRANDS = ['Coca-Cola','Tang','Arcor','Santa Helena','OZ','Nestlé','Lacta'];

function mountBars(){
  // categorias
  $('#catsBar').innerHTML = CATS.map((c,i)=>`
    <button class="chip ${i===0?'active':''}" data-cat="${c.key}">${c.label}</button>
  `).join('');

  // marcas principais
  $('#brandsBar').innerHTML = MAIN_BRANDS.map(b=>`
    <button class="chip chip-brand" data-brand="${b.toLowerCase()}">${b}</button>
  `).join('');
}

// outras marcas (chips em sessão separada)
function mountOtherBrands(brandsJson){
  let list = ['Freegells','Garoto','Pipper','Chita','Haribo','Fini','Peccin','Dori','Fazer'];
  if (brandsJson){
    if (Array.isArray(brandsJson)) list = brandsJson;
    if (brandsJson.others) list = brandsJson.others;
  }
  $('#otherBrands').innerHTML = list.map(b=>`
    <button class="chip" data-other-brand="${b.toLowerCase()}">${b}</button>
  `).join('');
}

// ---- Render grid ----
function normalizeProduct(p){
  return {
    id: p.id ?? p.codigo ?? crypto.randomUUID(),
    name: p.name ?? p.nome ?? p.titulo ?? 'Produto',
    brand: (p.brand ?? p.marca ?? '').toString(),
    cat: (p.cat ?? p.categoria ?? '').toString().toLowerCase(),
    price: Number(p.price ?? p.preco ?? p.valor ?? 0),
    promo: Boolean(p.promo ?? p.promocao ?? p.em_promocao ?? false),
    img: p.img ?? p.imagem ?? p.image ?? 'https://picsum.photos/seed/du-doces/600/400'
  };
}

function render(list){
  if(!list.length){
    grid.innerHTML = `<p style="opacity:.7">Nenhum produto encontrado.</p>`;
    return;
  }
  grid.innerHTML = list.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="${p.name}">
      <div class="p16">
        <div class="title">${p.name}</div>
        <div class="brand">${p.brand}</div>
        <div class="row">
          <strong>R$ ${p.price.toFixed(2)}</strong>
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
    list = list.filter(p => (p.brand||'').toLowerCase() === activeBrand);
  }
  if(otherBrandsSelected.size){
    list = list.filter(p => otherBrandsSelected.has((p.brand||'').toLowerCase()));
  }
  if(promoOnly.checked){
    list = list.filter(p => p.promo);
  }

  switch(sortSel.value){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: /* relevance */ break;
  }
  render(list);
}

// ---- Events ----
document.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip');

  // categoria
  if(chip && chip.dataset.cat){
    document.querySelectorAll('#catsBar .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    activeCat = chip.dataset.cat;
    activeBrand = null;                         // limpa marca principal
    otherBrandsSelected.clear();                // limpa outras marcas
    document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
    applyFilters();
    return;
  }

  // marca principal
  if(chip && chip.dataset.brand){
    document.querySelectorAll('#brandsBar .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    activeBrand = chip.dataset.brand;
    activeCat = 'tudo';                         // reseta categoria
    otherBrandsSelected.clear();
    document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
    applyFilters();
    return;
  }

  // outras marcas (toggle multi)
  if(chip && chip.dataset.otherBrand){
    const key = chip.dataset.otherBrand;
    chip.classList.toggle('active');
    if(chip.classList.contains('active')) otherBrandsSelected.add(key);
    else otherBrandsSelected.delete(key);
    activeBrand = null;                         // se escolher outras marcas, limpa principal
    applyFilters();
    return;
  }

  // adicionar carrinho
  if(e.target.matches('[data-add]')){
    const count = document.getElementById('cart-count');
    count.textContent = String(parseInt(count.textContent,10)+1);
    return;
  }
});

// filtros
[sortSel,promoOnly].forEach(elm => on(elm,'input', applyFilters));
on(btnClear,'click', ()=>{
  promoOnly.checked = false;
  sortSel.value = 'relevance';
  document.querySelectorAll('.chip.active').forEach(c=>c.classList.remove('active'));
  document.querySelector('[data-cat="tudo"]')?.classList.add('active');
  activeCat = 'tudo';
  activeBrand = null;
  otherBrandsSelected.clear();
  document.querySelectorAll('[data-other-brand].active').forEach(c=>c.classList.remove('active'));
  applyFilters();
});

// Drawer & modais
on($('#btn-menu'),'click', ()=>$('#drawer').classList.add('open'));
on($('#close-drawer'),'click', ()=>$('#drawer').classList.remove('open'));
on($('#drawer'),'click', (e)=>{ if(e.target.id==='drawer') e.currentTarget.classList.remove('open'); });

document.querySelectorAll('[data-open]').forEach(btn=>{
  on(btn,'click', ()=>{
    const id = btn.getAttribute('data-open');
    $('#drawer').classList.remove('open');
    const modal = $('#modal-'+id);
    modal?.classList.add('open');
  });
});
document.querySelectorAll('[data-close]').forEach(btn=>{
  on(btn,'click', ()=>btn.closest('.modal').classList.remove('open'));
});
document.querySelectorAll('.modal').forEach(m=>{
  on(m,'click', (e)=>{ if(e.target.classList.contains('modal')) m.classList.remove('open'); });
});

// IA (placeholder)
on($('#btn-ia'),'click', ()=>alert('IA: em breve conectaremos o ChatVolt aqui. 😉'));

// Modo escuro
function setTheme(mode){
  if(mode==='dark'){ document.body.classList.add('dark'); localStorage.setItem('theme','dark'); }
  else{ document.body.classList.remove('dark'); localStorage.setItem('theme','light'); }
}
on($('#toggle-dark'),'click', ()=>{
  const dark = !document.body.classList.contains('dark');
  setTheme(dark?'dark':'light');
});
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
    const [prods, brands] = await Promise.all([
      fetch('./assets/products.json').then(r=>r.json()),
      fetch('./assets/brands.json').then(r=>r.json()).catch(()=>null)
    ]);
    PRODUCTS = (Array.isArray(prods)?prods:[]).map(normalizeProduct);
    mountOtherBrands(brands);
  }catch(e){
    // fallback para garantir layout
    PRODUCTS = [
      { id:1, name:"Bala Hortelã", brand:"Arcor", cat:"bala", price:2.99, promo:true,  img:"https://picsum.photos/seed/bala/600/400" },
      { id:2, name:"Chocolate Ao Leite 90g", brand:"Nestlé", cat:"chocolate", price:7.49, promo:false, img:"https://picsum.photos/seed/choc/600/400" },
      { id:3, name:"Refrigerante Lata 350ml", brand:"Coca-Cola", cat:"salgadinho", price:4.99, promo:true,  img:"https://picsum.photos/seed/coke/600/400" },
      { id:4, name:"Tang Laranja", brand:"Tang", cat:"chiclete", price:1.49, promo:false, img:"https://picsum.photos/seed/tang/600/400" },
      { id:5, name:"Amendoim Japonês", brand:"Santa Helena", cat:"salgadinho", price:8.90, promo:false, img:"https://picsum.photos/seed/amendoim/600/400" },
    ].map(normalizeProduct);
    mountOtherBrands(null);
  }
  applyFilters();
}

// boot
document.addEventListener('DOMContentLoaded', ()=>{
  mountBars();
  loadBanners();
  loadData();
});
