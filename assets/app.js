// Caso você já tenha assets/products.json, brands.json etc., podemos plugar aqui.
// Por ora, deixo uma listinha mock pra garantir layout.

const PRODUCTS = [
  { id:1, name:"Bala Hortelã", brand:"Arcor", cat:"bala", price:2.99, promo:true, img:"https://picsum.photos/seed/bala/400/300" },
  { id:2, name:"Chocolate Ao Leite 90g", brand:"Nestlé", cat:"chocolate", price:7.49, promo:false, img:"https://picsum.photos/seed/choc/400/300" },
  { id:3, name:"Refri Lata 350ml", brand:"Coca-Cola", cat:"salgadinho", price:4.99, promo:true, img:"https://picsum.photos/seed/coke/400/300" },
  { id:4, name:"Tang Laranja", brand:"Tang", cat:"chiclete", price:1.49, promo:false, img:"https://picsum.photos/seed/tang/400/300" },
  { id:5, name:"Amendoim Japonês", brand:"Santa Helena", cat:"salgadinho", price:8.90, promo:false, img:"https://picsum.photos/seed/amendoim/400/300" },
];

const OTHER_BRANDS = ["Freegells","Garoto","Pipper","Chita","OZ","Lacta"];

const $ = (s)=>document.querySelector(s);
const grid = $('#productsGrid');
const sortSel = $('#sort');
const promoOnly = $('#promoOnly');
const minPrice = $('#minPrice');
const maxPrice = $('#maxPrice');
const btnClear = $('#btn-clear');

function mountOtherBrands(){
  const wrap = $('#otherBrands');
  wrap.innerHTML = OTHER_BRANDS.map(b => `
    <label class="chk"><input type="checkbox" class="ob" value="${b}"><span>${b}</span></label>
  `).join('');
}
mountOtherBrands();

let activeCat = 'tudo';
let activeBrand = null;

function render(list){
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

function applyFilters(){
  let list = [...PRODUCTS];

  if(activeCat !== 'tudo'){
    list = list.filter(p => p.cat === activeCat);
  }
  if(activeBrand){
    list = list.filter(p => p.brand.toLowerCase() === activeBrand);
  }
  const obs = [...document.querySelectorAll('.ob:checked')].map(i=>i.value.toLowerCase());
  if(obs.length){
    list = list.filter(p => obs.includes(p.brand.toLowerCase()));
  }
  if(promoOnly.checked){
    list = list.filter(p => p.promo);
  }
  const min = parseFloat(minPrice.value.replace(',','.'));
  const max = parseFloat(maxPrice.value.replace(',','.'));
  if(!Number.isNaN(min)) list = list.filter(p => p.price >= min);
  if(!Number.isNaN(max)) list = list.filter(p => p.price <= max);

  switch(sortSel.value){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: break;
  }
  render(list);
}

document.addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip');
  if(chip){
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
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
    const count = document.getElementById('cart-count');
    count.textContent = String(parseInt(count.textContent,10)+1);
  }
});

[sortSel,promoOnly,minPrice,maxPrice].forEach(elm => {
  elm.addEventListener('input', applyFilters);
});
btnClear.addEventListener('click', ()=>{
  promoOnly.checked = false;
  minPrice.value = '';
  maxPrice.value = '';
  document.querySelectorAll('.ob:checked').forEach(i=>i.checked=false);
  applyFilters();
});

applyFilters();
