// ------- utils -------
const $  = (s)=>document.querySelector(s);
const $$ = (s)=>[...document.querySelectorAll(s)];
const money = (v)=>`R$ ${Number(v).toFixed(2)}`;

// ------- estado -------
let PRODUCTS = [];
let activeCat   = 'tudo';
let activeBrand = null;

// ------- carga de dados -------
async function loadJSON(path, fallback=null){
  try {
    const r = await fetch(path, {cache:'no-store'});
    if(!r.ok) throw new Error(r.status);
    return await r.json();
  } catch {
    return fallback;
  }
}

async function bootstrap(){
  const [prods, brands, banners] = await Promise.all([
    loadJSON('./assets/products.json', []),
    loadJSON('./assets/brands.json', {others:["Freegells","Garoto","Pipper","Chita","OZ","Lacta"]}),
    loadJSON('./assets/banners.json', []),
  ]);

  PRODUCTS = sanitizeProducts(prods);
  mountOtherBrands(brands?.others || []);
  mountBanners(banners);

  bindUI();
  applyFilters();
}

function sanitizeProducts(list){
  return (list || []).map((p,i)=>({
    id: p.id ?? i+1,
    name: p.name ?? p.nome ?? 'Produto',
    brand: (p.brand ?? p.marca ?? '').toString(),
    cat: (p.cat ?? p.categoria ?? 'outros').toString().toLowerCase(),
    price: Number(p.price ?? p.preco ?? 0),
    promo: Boolean(p.promo ?? p.promocao ?? false),
    img: p.img ?? p.imagem ?? 'https://picsum.photos/seed/prod'+(i+1)+'/400/300'
  }));
}

// ------- UI: banners -------
function mountBanners(items=[]){
  const el = $('#banners');
  if(!items.length){ el.innerHTML=''; return; }
  el.innerHTML = items.map(src=>`<div class="banner"><img src="${src}" loading="lazy" alt="banner"></div>`).join('');
}

// ------- UI: outras marcas -------
function mountOtherBrands(list){
  $('#otherBrands').innerHTML = list.map(b => `
    <label class="chk"><input type="checkbox" class="ob" value="${b}">
      <span>${b}</span>
    </label>
  `).join('');
}

// ------- render de produtos -------
function render(list){
  const grid = $('#productsGrid');
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
          <strong>${money(p.price)}</strong>
          <button class="btn btn-outline" data-add="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ------- filtros -------
function applyFilters(){
  let list = [...PRODUCTS];

  if(activeCat !== 'tudo'){
    list = list.filter(p => p.cat === activeCat);
  }
  if(activeBrand){
    list = list.filter(p => p.brand.toLowerCase() === activeBrand);
  }

  const obs = $$('.ob:checked').map(i=>i.value.toLowerCase());
  if(obs.length){ list = list.filter(p => obs.includes(p.brand.toLowerCase())); }

  if($('#promoOnly').checked){ list = list.filter(p => p.promo); }

  const min = parseFloat($('#minPrice').value.replace(',','.'));
  const max = parseFloat($('#maxPrice').value.replace(',','.'));
  if(!Number.isNaN(min)) list = list.filter(p => p.price >= min);
  if(!Number.isNaN(max)) list = list.filter(p => p.price <= max);

  switch($('#sort').value){
    case 'price-asc':  list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'name-asc':   list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: /* relevance */ break;
  }

  render(list);
}

// ------- binds -------
function bindUI(){
  // chips
  document.addEventListener('click', (e)=>{
    const chip = e.target.closest('.chip');
    if(chip){
      $$('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');

      if(chip.dataset.cat){
        activeCat = chip.dataset.cat;
        activeBrand = null;
      }
      if(chip.dataset.brand){
        activeBrand = chip.dataset.brand;
        activeCat = 'tudo';
      }
      applyFilters();
    }

    if(e.target.matches('[data-add]')){
      const count = $('#cart-count');
      count.textContent = String(parseInt(count.textContent,10)+1);
    }
  });

  // filtros
  ['change','input'].forEach(ev=>{
    $('#sort').addEventListener(ev, applyFilters);
    $('#promoOnly').addEventListener(ev, applyFilters);
    $('#minPrice').addEventListener(ev, applyFilters);
    $('#maxPrice').addEventListener(ev, applyFilters);
  });

  $('#btn-clear').addEventListener('click', ()=>{
    $('#promoOnly').checked = false;
    $('#minPrice').value = '';
    $('#maxPrice').value = '';
    $$('.ob:checked').forEach(i=>i.checked=false);
    applyFilters();
  });

  // drawer
  $('#btn-menu')?.addEventListener('click', ()=>$('#drawer').classList.add('open'));
  $('#close-drawer')?.addEventListener('click', ()=>$('#drawer').classList.remove('open'));
  $('#drawer')?.addEventListener('click', (e)=>{ if(e.target.id==='drawer') e.currentTarget.classList.remove('open'); });

  // IA (placeholder)
  $('#btn-ia')?.addEventListener('click', ()=>alert('IA: em breve conectamos ao ChatVolt 😉'));
}

document.addEventListener('DOMContentLoaded', bootstrap);
