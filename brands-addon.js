// ADDON de marcas (não altera sua base). Requer:
// - Um container com id="brandsGrid"
// - Dois chips com data-filter="principais" e data-filter="todas"
// - Opcional: window.__API_BASE__ para apontar o backend em produção

(function(){
  const API_BASE = (window.__API_BASE__) || "https://SEU-BACKEND.up.railway.app";
  const PRINCIPAIS = new Set(["COCA-COLA","TANG","ARCOR","SANTA HELENA","OZ","NESTLE","LACTA"]);
  const norm = s => (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toUpperCase();

  const grid = document.getElementById('brandsGrid');
  if(!grid){ console.warn("[addons] brandsGrid não encontrado"); return; }
  const chips = document.querySelectorAll('.chip[data-filter]');

  let allBrands = [];

  function renderBrands(list){
    grid.innerHTML = "";
    list.forEach(b=>{
      const card = document.createElement('div');
      card.className = "icon-card brand-card";
      card.innerHTML = `
        <img data-icon src="${b.logoUrl || './assets/brand-placeholder.svg'}" alt="${b.name}" width="36" height="36">
        <div>
          <div style="font-weight:700">${b.name}</div>
          <div style="opacity:.6;font-size:12px">${b.segment || ''}</div>
        </div>
      `;
      card.addEventListener('click', ()=> filtrarProdutosPorMarca(b.name));
      grid.appendChild(card);
    });
  }

  async function carregarMarcas(){
    try{
      const r = await fetch(API_BASE + "/api/brands", { cache:"no-store" });
      if(!r.ok) throw 0;
      allBrands = await r.json();
    }catch{
      allBrands = [
        { name:"Coca-Cola" }, { name:"Tang" }, { name:"Arcor" },
        { name:"Santa Helena" }, { name:"OZ" }, { name:"Nestlé" }, { name:"LACTA" }
      ];
    }
    const principais = allBrands.filter(b => PRINCIPAIS.has(norm(b.name)));
    renderBrands(principais);
  }

  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.toggle('active', c===ch));
      const key = ch.getAttribute('data-filter');
      if(key === 'principais'){
        renderBrands(allBrands.filter(b => PRINCIPAIS.has(norm(b.name))));
      }else{
        renderBrands(allBrands);
      }
    });
  });

  async function filtrarProdutosPorMarca(marca){
    try{
      const r = await fetch(API_BASE + "/api/products?brand=" + encodeURIComponent(marca), { cache:"no-store" });
      const produtos = r.ok ? await r.json() : [];
      // Integre aqui com seu renderizador de produtos existente:
      document.dispatchEvent(new CustomEvent("du:filtrar-marca", { detail:{ marca, produtos } }));
      console.log("[addons] Produtos de", marca, produtos);
    }catch(e){
      console.error("[addons] erro ao filtrar por marca", e);
    }
  }

  carregarMarcas();
})();
