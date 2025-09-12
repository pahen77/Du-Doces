import { API_BASE } from './config.js';

// PRINCIPAIS definidas pelo cliente
const PRINCIPAIS_SET = new Set([
  "COCA-COLA",
  "TANG",
  "ARCOR",
  "SANTA HELENA",
  "OZ",
  "NESTLE",
  "LACTA"
]);

// util pra normalizar (remove acentos e coloca em maiúsculas)
const norm = (s) => (s || "")
  .normalize("NFD")
  .replace(/[^\p{L}\p{N}\s.-]/gu, "") // remove acentos via unicode class
  .trim()
  .toUpperCase();

const grid = document.getElementById('brandsGrid');
const chips = document.querySelectorAll('.chip');

let allBrands = [];

function renderBrands(brands){
  grid.innerHTML = "";
  brands.forEach(b=>{
    const el = document.createElement('div');
    el.className = "icon-card";
    el.innerHTML = `
      <img src="${b.logoUrl || './assets/brand-placeholder.svg'}" alt="${b.name}" style="width:36px;height:36px;border-radius:10px;object-fit:contain;background:#fff;padding:4px">
      <div>
        <div style="font-weight:700">${b.name}</div>
        <div style="opacity:.6;font-size:12px">${b.segment || ''}</div>
      </div>
    `;
    el.onclick = ()=> carregarProdutosPorMarca(b.name);
    grid.appendChild(el);
  });
  if(brands.length === 0){
    const empty = document.createElement('div');
    empty.textContent = "Nenhuma marca encontrada.";
    grid.appendChild(empty);
  }
}

async function carregarMarcas(){
  try{
    const r = await fetch(`${API_BASE}/api/brands`, { cache: "no-store" });
    if(!r.ok) throw new Error("Falha ao buscar /api/brands");
    allBrands = await r.json(); // [{name, logoUrl, segment}, ...]

    const principais = allBrands.filter(b => PRINCIPAIS_SET.has(norm(b.name)));
    renderBrands(principais);
  }catch(e){
    console.error(e);
    // fallback de demonstração se a API não estiver disponível
    allBrands = [
      { name: "Coca-Cola", logoUrl: "./assets/brand-placeholder.svg", segment: "Bebidas" },
      { name: "Tang", logoUrl: "./assets/brand-placeholder.svg", segment: "Bebidas em pó" },
      { name: "Arcor", logoUrl: "./assets/brand-placeholder.svg", segment: "Doces" },
      { name: "Santa Helena", logoUrl: "./assets/brand-placeholder.svg", segment: "Amendoins" },
      { name: "OZ", logoUrl: "./assets/brand-placeholder.svg", segment: "Snacks" },
      { name: "Nestlé", logoUrl: "./assets/brand-placeholder.svg", segment: "Alimentos" },
      { name: "LACTA", logoUrl: "./assets/brand-placeholder.svg", segment: "Chocolates" },
      { name: "Bauducco", logoUrl: "./assets/brand-placeholder.svg", segment: "Biscoitos" },
      { name: "Trident", logoUrl: "./assets/brand-placeholder.svg", segment: "Chicletes" },
    ];
    const principais = allBrands.filter(b => PRINCIPAIS_SET.has(norm(b.name)));
    renderBrands(principais);
  }
}

function setActiveChip(key){
  chips.forEach(c => c.classList.toggle('active', c.dataset.filter === key));
}

chips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    const key = chip.dataset.filter;
    setActiveChip(key);
    if(key === 'principais'){
      const principais = allBrands.filter(b => PRINCIPAIS_SET.has(norm(b.name)));
      renderBrands(principais);
    } else {
      renderBrands(allBrands);
    }
  });
});

async function carregarProdutosPorMarca(marca){
  try{
    const r = await fetch(`${API_BASE}/api/products?brand=${encodeURIComponent(marca)}`, { cache:"no-store" });
    const produtos = await r.json();
    console.log("Produtos da marca", marca, produtos);
    alert("Filtrando por marca: " + marca + " (veja console)");
  }catch(e){
    console.error(e);
  }
}

carregarMarcas();
