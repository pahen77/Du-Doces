// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import AdminPanel from "./admin/AdminPanel";
import { api } from "./lib/api";

const BRAND = { name: "Du Doces", primary: "#0B3B8C", textOnPrimary: "#FFFFFF" };

function money(v){ return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }

export default function App(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [adminOpen,setAdminOpen]=useState(false);
  const [activeCategory,setActiveCategory]=useState(null);
  const [sort,setSort]=useState("asc");
  const [promoOnly,setPromoOnly]=useState(false);
  const [brandFilter,setBrandFilter]=useState("todas");
  const [banners,setBanners]=useState([]);
  const [products,setProducts]=useState([]);
  const [brands,setBrands]=useState([]);
  const [categories,setCategories]=useState([]);
  const [slide,setSlide]=useState(0);
  const [cep,setCep]=useState("");
  const [frete,setFrete]=useState(null);
  const [cart,setCart]=useState([]); // [{id, name, price, qty, imageUrl, spec}]

  // carregar conteúdos públicos do backend
  useEffect(()=>{
    (async()=>{
      try{
        const [cats, brs] = await Promise.all([api.categories(), api.brands()]);
        setCategories(cats); setBrands(brs);
        // pega produtos iniciais (promos/landing)
        const list = await api.products({ pageSize: '100' });
        setProducts(list.items || []);
      }catch(e){ console.error(e); }
    })();
    fetch("/banners.json").then(r=>r.json()).then(setBanners).catch(()=>setBanners([]));
  },[]);

  useEffect(()=>{
    if(!banners.length) return;
    const id = setInterval(()=>setSlide(s=>(s+1)%banners.length), 4000);
    return ()=>clearInterval(id);
  },[banners]);

  const brandNames = useMemo(()=>["todas", ...brands.map(b=>b.slug)], [brands]);

  const filtered = useMemo(()=>{
    let data = [...products];
    if (activeCategory) data = data.filter(p => p.category?.slug === activeCategory);
    else data = data.filter(p => p.promo || ["chocolate","salgadinhos","bebidas"].includes(p.category?.slug));
    if (promoOnly) data = data.filter(p => p.promo);
    if (brandFilter !== "todas") data = data.filter(p => p.brand?.slug === brandFilter);
    data.sort((a,b)=> sort==="asc" ? a.price-b.price : b.price-a.price);
    return data;
  },[products, activeCategory, promoOnly, brandFilter, sort]);

  // Carrinho
  const addToCart = (p) => {
    setCart(c => {
      const i = c.findIndex(x => x.id===p.id);
      if (i>=0) { const copy=[...c]; copy[i]={...copy[i], qty: copy[i].qty+1}; return copy; }
      return [...c, { id:p.id, name:p.name, price:p.price, qty:1, imageUrl:p.imageUrl, spec:p.spec }];
    });
  };
  const dec = (id) => setCart(c => c.flatMap(it => it.id!==id ? [it] : (it.qty>1 ? [{...it, qty: it.qty-1}] : [])));
  const inc = (id) => setCart(c => c.map(it => it.id===id ? {...it, qty: it.qty+1} : it));
  const removeItem = (id) => setCart(c => c.filter(it => it.id!==id));
  const cartTotal = cart.reduce((s,it)=>s+it.price*it.qty,0);

  const onCalcularFrete = () => {
    const clean = (cep||"").replace(/\D/g,''); if(clean.length!==8){ setFrete({error:'CEP inválido'}); return; }
    const first = parseInt(clean[0],10);
    const base=12.90, regionFactor=[1.0,1.0,1.05,1.10,1.15,1.20,1.25,1.30,1.35,1.40][first]||1.25, perKg=3.50, eta=Math.max(2,Math.round(2+(first*0.6)));
    const price = +(base*regionFactor+1.2*perKg).toFixed(2);
    setFrete({price,eta});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER AZUL ESCURO FIXO */}
      <header className="fixed top-0 inset-x-0 z-50 border-b" style={{ background: BRAND.primary, color: BRAND.textOnPrimary }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-bold text-white text-lg">D</div>
            <span className="font-semibold text-xl tracking-wide select-none">{BRAND.name}</span>
          </div>

          {/* CEP no centro */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <input className="bg-transparent placeholder-white/80 text-white outline-none w-48" placeholder="Seu CEP" value={cep} onChange={e=>setCep(e.target.value)} />
            <button className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30" onClick={onCalcularFrete}>Calcular</button>
            {frete?.price && <span className="text-sm ml-2">Frete {money(frete.price)} • {frete.eta}d</span>}
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20" onClick={()=>setAdminOpen(true)}>
              Entrar / Admin
            </button>
            <button aria-label="Carrinho" onClick={()=>setMenuOpen(true)} className="p-2 rounded-md bg-white/10 hover:bg-white/20">
              <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l-2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* SLIDEOVER CARRINHO */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setMenuOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full md:w-[420px] bg-white shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Seu carrinho</h3>
              <button className="p-2 rounded-md hover:bg-gray-100" onClick={()=>setMenuOpen(false)}>Fechar</button>
            </div>
            <div className="flex-1 overflow-auto space-y-3">
              {cart.map(it=>(
                <div key={it.id} className="p-3 border rounded-xl flex gap-3">
                  <img src={it.imageUrl || '/placeholder.png'} alt={it.name} className="w-16 h-16 object-cover rounded-md border" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{it.name}</div>
                    <div className="text-xs text-gray-500">{it.spec} • {money(it.price)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={()=>dec(it.id)} className="px-2 py-1 rounded-md border">−</button>
                      <span className="w-8 text-center">{it.qty}</span>
                      <button onClick={()=>inc(it.id)} className="px-2 py-1 rounded-md border">+</button>
                      <button onClick={()=>removeItem(it.id)} className="ml-auto px-2 py-1 rounded-md border text-red-600">Remover</button>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length===0 && <div className="text-sm text-gray-500 text-center py-10">Seu carrinho está vazio.</div>}
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between font-semibold mb-2">
                <span>Total</span><span>{money(cartTotal)}</span>
              </div>
              <button className="w-full py-2 rounded-xl text-white" style={{ background: BRAND.primary }} onClick={()=>alert('Checkout em breve')}>
                Finalizar compra
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN */}
      <main className="pt-20 pb-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* BANNERS */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow">
            <div className="whitespace-nowrap transition-transform duration-700" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {banners.map(b=>(
                <div key={b.id} className="inline-flex items-center justify-between w-full h-48 md:h-60 px-8" style={{ background:b.bg }}>
                  <div className="text-white">
                    <h3 className="text-2xl md:text-3xl font-bold">{b.title}</h3>
                    <p className="opacity-90">{b.subtitle}</p>
                  </div>
                  <div className="hidden sm:block opacity-60">
                    <div className="w-32 h-32 rounded-full" style={{ background:"radial-gradient(circle,#ffffff66,#ffffff0)" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {banners.map((_,i)=>(
                <button key={i} className={`w-2.5 h-2.5 rounded-full ${i===slide?"bg-white":"bg-white/50"}`} onClick={()=>setSlide(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* MARCAS (com logo) */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Marcas</h2>
            {brandFilter!=='todas' && <button onClick={()=>setBrandFilter('todas')} className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">Limpar</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {brands.map(m=>(
              <button key={m.id} onClick={()=>setBrandFilter(m.slug)} className={`rounded-xl border bg-white hover:shadow transition p-3 flex flex-col items-center ${brandFilter===m.slug?'ring-2 ring-blue-500':''}`}>
                <img src={m.logoUrl || '/placeholder.png'} alt={m.name} className="h-12 object-contain" />
                <span className="text-sm mt-2 font-medium">{m.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* CATEGORIAS */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Categorias</h2>
            {activeCategory && <button onClick={()=>setActiveCategory(null)} className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">Limpar</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {categories.map(c=>(
              <button key={c.id} onClick={()=>setActiveCategory(c.slug)} className={`rounded-xl border bg-white hover:shadow transition p-3 text-sm font-medium ${activeCategory===c.slug?'ring-2 ring-blue-500':''}`}>
                {c.name}
              </button>
            ))}
          </div>
        </section>

        {/* FILTROS */}
        <section className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              Ordenar por preço:
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="px-2 py-1 rounded-md border">
                <option value="asc">Menor → Maior</option>
                <option value="desc">Maior → Menor</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={promoOnly} onChange={e=>setPromoOnly(e.target.checked)} />
              Apenas promoções
            </label>
          </div>
        </section>

        {/* PRODUTOS */}
        <section className="mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p=>(
              <article key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="h-36 md:h-40 w-full bg-gray-100 flex items-center justify-center">
                  <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="h-full object-contain" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium leading-tight line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-semibold">{money(p.price)}</span>
                    <span className="text-xs text-gray-500">{p.spec}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{p.brand?.name}</div>
                  {p.promo && <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Promoção</div>}
                  <button onClick={()=>addToCart(p)} className="mt-3 w-full py-2 rounded-xl text-sm font-medium text-white" style={{ background: BRAND.primary }}>
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length===0 && <div className="text-center text-sm text-gray-500 py-10">Nenhum produto encontrado.</div>}
        </section>
      </main>

      <AdminPanel open={adminOpen} onClose={()=>setAdminOpen(false)} />

      <footer className="text-center text-xs text-gray-500 py-6">© {new Date().getFullYear()} {BRAND.name}.</footer>
    </div>
  );
}
