import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

/** FRONT config */
const BRAND = {
  name: "DU DOCES",
  primary: "var(--brand)",
  textOnPrimary: "#FFFFFF",
};

// se você setar no Vercel: VITE_API_URL=https://SEU-BACKEND.up.railway.app
const API_URL = import.meta.env.VITE_API_URL || "";

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sort, setSort] = useState("asc");
  const [promoOnly, setPromoOnly] = useState(false);
  const [brand, setBrand] = useState("todas");
  const [cartTotal, setCartTotal] = useState(0);
  const [cart, setCart] = useState([]); // [{id, name, price, qty}]
  const [banners, setBanners] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [slide, setSlide] = useState(0);

  // CEP no header (ao lado do carrinho)
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(null);

  // Admin
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("isAdmin") === "1"
  );
  const [adminOpen, setAdminOpen] = useState(false);

  // Load JSONs from /public (fallback “estático”)
  useEffect(() => {
    fetch("/banners.json").then(r => r.json()).then(setBanners).catch(() => setBanners([]));
    fetch("/products.json").then(r => r.json()).then(setAllProducts).catch(() => setAllProducts([]));
  }, []);

  // Banner auto-rotate
  useEffect(() => {
    if (!banners.length) return;
    const id = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(id);
  }, [banners]);

  const brands = useMemo(() => {
    const set = new Set(allProducts.map(p => p.brand));
    return ["todas", ...Array.from(set)];
  }, [allProducts]);

  // Produtos filtrados
  const filtered = useMemo(() => {
    let data = [...allProducts];
    if (activeCategory) data = data.filter(p => p.category === activeCategory);
    else data = data.filter(p => p.promo || ["chocolate","salgadinhos","bebidas"].includes(p.category));
    if (promoOnly) data = data.filter(p => p.promo);
    if (brand !== "todas") data = data.filter(p => p.brand === brand);
    data.sort((a,b) => sort === "asc" ? a.price - b.price : b.price - a.price);
    return data;
  }, [allProducts, activeCategory, promoOnly, brand, sort]);

  // Carrinho
  function addToCart(prod){
    setCart(prev=>{
      const i = prev.findIndex(x=>x.id===prod.id);
      if(i>=0){
        const copy=[...prev]; copy[i]={...copy[i], qty: copy[i].qty+1};
        return copy;
      }
      return [...prev, {...prod, qty:1}];
    });
  }
  function inc(id){ setCart(prev=>prev.map(i=>i.id===id?{...i,qty:i.qty+1}:i)); }
  function dec(id){ setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty-1)}:i)); }
  function removeItem(id){ setCart(prev=>prev.filter(i=>i.id!==id)); }

  useEffect(()=>{
    setCartTotal(cart.reduce((s,i)=>s+i.price*i.qty,0));
  },[cart]);

  // Frete simples
  function estimateFrete(cep) {
    const clean = (cep || "").replace(/\D/g, "");
    if (clean.length !== 8) return { ok:false, msg:"CEP inválido. Use 8 dígitos." };
    const first = parseInt(clean[0],10);
    const base = 12.90;
    const regionFactor = [1.0,1.0,1.05,1.10,1.15,1.20,1.25,1.30,1.35,1.40][first] || 1.25;
    const weightKg = 1.2;
    const perKg = 3.50;
    const prazo = Math.max(2, Math.round(2 + (first * 0.6)));
    const valor = +(base * regionFactor + weightKg * perKg).toFixed(2);
    return { ok:true, valor, prazo };
  }
  const onCalcularFrete = () => {
    const r = estimateFrete(cep);
    if (!r.ok) setFrete({ error: r.msg });
    else setFrete({ price: r.valor, eta: r.prazo });
  };

  // Admin login simples (temporário)
  function doLogin(){
    const pass = prompt("Senha de administrador:");
    // troque por fluxo real depois; isto é só para liberar o modal
    if(pass && pass === (import.meta.env.VITE_ADMIN_PASS || "admin123")){
      localStorage.setItem("isAdmin","1");
      setIsAdmin(true);
      alert("Admin autenticado.");
    }else{
      alert("Senha inválida.");
    }
  }
  function logout(){
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
  }

  // Cadastrar produto (usa API se existir, senão adiciona ao estado)
  async function createProduct(newP){
    try{
      // normaliza
      const p = {
        name: newP.name,
        category: newP.category,
        brand: newP.brand,
        price: Number(newP.price),
        spec: newP.spec,
        image: newP.image || "/images/placeholder.png",
        promo: !!newP.promo
      };

      if(API_URL){
        const res = await fetch(`${API_URL}/admin/products`, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(p)
        });
        if(!res.ok){
          const t = await res.text();
          throw new Error(t || "Erro ao cadastrar no servidor");
        }
        const saved = await res.json();
        // encaixa no front (caso backend retorne campos diferentes, mapeie aqui)
        setAllProducts(prev => [{ id:saved.id, ...p }, ...prev]);
      }else{
        // fallback local
        setAllProducts(prev => [{ id: Date.now(), ...p }, ...prev]);
      }

      setAdminOpen(false);
      alert("Produto cadastrado!");
    }catch(e){
      console.error(e);
      alert("Falha ao cadastrar: " + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header
        className="fixed top-0 inset-x-0 z-50 header-shadow"
        style={{ background: BRAND.primary, color: BRAND.textOnPrimary }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Botão 3 barras */}
          <button
            aria-label="Abrir menu"
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
            onClick={() => setMenuOpen(true)}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          </button>

          {/* Título central grande */}
          <div className="flex-1 flex justify-center">
            <h1 className="select-none font-black tracking-wide text-white text-lg sm:text-2xl">
              {BRAND.name}
            </h1>
          </div>

          {/* Area à direita: CEP + carrinho + user */}
          <div className="flex items-center gap-3">
            {/* CEP compacto */}
            <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-md px-2 py-1">
              <input
                className="bg-transparent text-white placeholder-white/70 outline-none text-sm w-28"
                placeholder="Seu CEP"
                value={cep}
                onChange={e=>setCep(e.target.value)}
              />
              <button className="btn bg-white/20 hover:bg-white/30 text-white" onClick={onCalcularFrete}>
                Calcular
              </button>
            </div>

            {/* Carrinho */}
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l-2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className="font-medium">{money(cartTotal)}</span>
            </div>

            {/* Usuário / Admin */}
            {isAdmin ? (
              <>
                <button className="btn bg-white/20 hover:bg-white/30 text-white" onClick={()=>setAdminOpen(true)}>
                  Cadastrar produto
                </button>
                <button className="btn bg-white/10 hover:bg-white/20 text-white" onClick={logout}>Sair</button>
              </>
            ) : (
              <button className="btn bg-white/20 hover:bg-white/30 text-white" onClick={doLogin}>
                Entrar
              </button>
            )}
          </div>
        </div>

        {/* Linha do frete (feedback) */}
        {frete?.price && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2 text-xs text-white/90">
            Frete estimado: <b>{money(frete.price)}</b> • Prazo {frete.eta} dias úteis
          </div>
        )}
        {frete?.error && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2 text-xs text-red-200">
            {frete.error}
          </div>
        )}
      </header>

      {/* MENU LATERAL */}
      {menuOpen && (
        <SideMenu onClose={()=>setMenuOpen(false)} />
      )}

      {/* MAIN */}
      <main className="pt-20 pb-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* BANNERS */}
        <Banners banners={banners} slide={slide} setSlide={setSlide} />

        {/* SESSÃO DE MERCADO (Categorias) */}
        <CategoriesBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        {/* FILTROS */}
        <section className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              Ordenar por preço:
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-2 py-1 rounded-md border">
                <option value="asc">Menor → Maior</option>
                <option value="desc">Maior → Menor</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={promoOnly} onChange={(e) => setPromoOnly(e.target.checked)} />
              Apenas promoções
            </label>

            <BrandSelect
              brands={brands}
              brand={brand}
              setBrand={setBrand}
            />
          </div>
        </section>

        {/* PRODUTOS */}
        <ProductGrid items={filtered} addToCart={addToCart} />
      </main>

      {/* MODAL ADMIN */}
      {adminOpen && <AdminModal onClose={()=>setAdminOpen(false)} onSubmit={createProduct} />}

      {/* FLOAT CHAT placeholder */}
      <button
        aria-label="Abrir ChatVolt"
        className="fixed bottom-5 right-5 z-50 shadow-xl rounded-full p-4 text-white"
        style={{ background: BRAND.primary }}
        onClick={() => alert("Abrindo ChatVolt… (placeholder)")}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 7l3 3" />
        </svg>
      </button>

      <footer className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
      </footer>
    </div>
  );
}

/** Componentes menores */

function SideMenu({onClose}) {
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={onClose}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          <a className="block p-3 rounded-lg hover:bg-gray-50" href="#ajuda">Ajuda</a>
          <a className="block p-3 rounded-lg hover:bg-gray-50" href="#sobre">Sobre nós</a>
          <a className="block p-3 rounded-lg hover:bg-gray-50" href="#contato">Contato</a>
        </nav>
      </aside>
    </div>
  );
}

function Banners({banners, slide, setSlide}){
  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-2xl shadow">
        <div className="whitespace-nowrap transition-transform duration-700" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {banners.map((b) => (
            <div key={b.id} className="inline-flex items-center justify-between w-full h-48 md:h-60 px-8" style={{ background: b.bg }}>
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold">{b.title}</h3>
                <p className="opacity-90">{b.subtitle}</p>
              </div>
              <div className="hidden sm:block opacity-60">
                <div className="w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle,#ffffff66,#ffffff0)" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button key={i} className={`w-2.5 h-2.5 rounded-full ${i === slide ? "bg-white" : "bg-white/50"}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesBar({ activeCategory, setActiveCategory }) {
  // “sessão de mercado”
  const categories = [
    { id: "higiene", label: "Higiene", emoji: "🧼" },
    { id: "limpeza", label: "Limpeza", emoji: "🧽" },
    { id: "chocolate", label: "Chocolate", emoji: "🍫" },
    { id: "salgadinhos", label: "Salgadinhos", emoji: "🥟" },
    { id: "bebidas", label: "Bebidas", emoji: "🥤" },
    { id: "padaria", label: "Padaria", emoji: "🥐" },
    { id: "biscoitos", label: "Biscoitos", emoji: "🍪" },
    { id: "infantil", label: "Infantil", emoji: "🍼" },
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Categorias</h2>
        {activeCategory && (
          <button onClick={() => setActiveCategory(null)} className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">
            Limpar filtro
          </button>
        )}
      </div>
      <div className="grid grid-rows-2 sm:grid-rows-2 grid-flow-col sm:grid-flow-col gap-3 overflow-x-auto sm:overflow-x-visible pb-1">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`min-w-[140px] sm:min-w-0 aspect-[3/1] rounded-xl border flex items-center justify-center gap-2 text-sm font-medium hover:shadow transition ${activeCategory === c.id ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
            <span className="text-lg">{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BrandSelect({ brands, brand, setBrand }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      Marca:
      <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-2 py-1 rounded-md border">
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </label>
  );
}

function ProductGrid({ items, addToCart }) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <article key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="h-36 md:h-40 w-full bg-gray-200 flex items-center justify-center">
              <img src={p.image} alt={p.name} className="h-full object-contain" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium leading-tight line-clamp-2">{p.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-semibold">{money(p.price)}</span>
                <span className="text-xs text-gray-500">{p.spec}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{p.brand}</div>
              {p.promo && <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Promoção</div>}
              <button onClick={() => addToCart(p)} className="mt-3 w-full py-2 rounded-xl text-sm font-medium text-white" style={{ background: "var(--brand)" }}>
                Adicionar
              </button>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && <div className="text-center text-sm text-gray-500 py-10">Nenhum produto encontrado com os filtros atuais.</div>}
    </section>
  );
}

/** Modal de cadastro */
function AdminModal({ onClose, onSubmit }){
  const [form, setForm] = useState({
    name:"", category:"", brand:"", price:"", spec:"unidade", image:"", promo:false
  });
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Cadastrar produto</h3>
            <button className="p-2 rounded-md hover:bg-gray-100" onClick={onClose}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nome" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/>
            <Input label="Marca" value={form.brand} onChange={v=>setForm(f=>({...f,brand:v}))}/>
            <Input label="Categoria" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))}/>
            <Input label="Preço (ex: 12.50)" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))}/>
            <Select label="Especificação" value={form.spec} onChange={v=>setForm(f=>({...f,spec:v}))}
                    options={[
                      {value:"unidade", label:"Unidade"},
                      {value:"pacote", label:"Pacote"},
                      {value:"caixa", label:"Caixa"},
                    ]}/>
            <Input label="URL da imagem" value={form.image} onChange={v=>setForm(f=>({...f,image:v}))}/>
            <label className="flex items-center gap-2 text-sm col-span-full">
              <input type="checkbox" checked={form.promo} onChange={e=>setForm(f=>({...f,promo:e.target.checked}))}/>
              Produto em promoção
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn border" onClick={onClose}>Cancelar</button>
            <button
              className="btn text-white"
              style={{background:"var(--brand)"}}
              onClick={()=>onSubmit(form)}
              disabled={!form.name || !form.brand || !form.category || !form.price}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({label,value,onChange}){
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <input className="input w-full" value={value} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}
function Select({label,value,onChange,options}){
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <select className="input w-full" value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
