import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

const BRAND = {
  name: "Du Doces",
  primary: "var(--brand)",
  textOnPrimary: "#FFFFFF",
};

const API_URL = import.meta.env.VITE_API_URL || ""; // ex: https://du-doces-production.up.railway.app

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // filtros
  const [activeCategory, setActiveCategory] = useState(null); // usa slug da categoria
  const [sort, setSort] = useState("asc"); // asc|desc (preço)
  const [promoOnly, setPromoOnly] = useState(false);
  const [brand, setBrand] = useState("todas"); // slug da marca

  // dados
  const [cartTotal, setCartTotal] = useState(0);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);           // [{id, name, slug}]
  const [products, setProducts] = useState([]);       // já vem filtrados da API
  const [loading, setLoading] = useState(false);

  // ui
  const [slide, setSlide] = useState(0);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(null);

  // ---- BANNERS (estático no /public) ----
  useEffect(() => {
    fetch("/banners.json")
      .then(r => r.json())
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  // rotaciona banner
  useEffect(() => {
    if (!banners.length) return;
    const id = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(id);
  }, [banners]);

  // ---- BRANDS (API) ----
  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/brands`)
      .then(r => r.json())
      .then(list => setBrands(list || []))
      .catch(() => setBrands([]));
  }, []);

  // helper para exibir nome de marca pelo slug
  const brandNameBySlug = (slug) =>
    (brands.find(b => b.slug === slug)?.name) || slug;

  // ---- PRODUCTS (API) ----
  useEffect(() => {
    if (!API_URL) return;

    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (brand !== "todas") params.set("brand", brand);
    if (promoOnly) params.set("promo", "true");
    params.set("order", `price_${sort}`);
    params.set("page", "1");
    params.set("pageSize", "100");

    const url = `${API_URL}/products?${params.toString()}`;

    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then((data) => {
        const items = Array.isArray(data?.items) ? data.items : [];
        // mapeia o shape do backend -> frontend
        const mapped = items.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          spec: p.spec,
          image: p.imageUrl || "/images/placeholder.png",
          promo: !!p.promo,
          brandSlug: p.brand?.slug,
          brandName: p.brand?.name,
          categorySlug: p.category?.slug,
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, brand, promoOnly, sort]);

  const brandOptions = useMemo(
    () => ["todas", ...brands.map(b => b.slug)],
    [brands]
  );

  const addToCart = (price) => setCartTotal(t => t + price);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 border-b" style={{ background: BRAND.primary, color: BRAND.textOnPrimary }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button aria-label="Abrir menu" className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition" onClick={() => setMenuOpen(true)}>
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </div>
          </button>

          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">D</div>
            <span className="font-semibold text-lg tracking-wide">{BRAND.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l-2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="font-medium">{money(cartTotal)}</span>
          </div>
        </div>
      </header>

      {/* MENU LATERAL */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
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
            <div className="mt-6 p-3 rounded-lg border">
              <p className="text-sm font-medium mb-2">Calcular frete</p>
              <div className="flex gap-2">
                <input className="border rounded-md px-2 py-1 text-sm w-full" placeholder="Digite seu CEP" value={cep} onChange={e => setCep(e.target.value)} />
                <button className="px-3 py-1.5 text-sm rounded-md text-white" style={{ background: BRAND.primary }} onClick={onCalcularFrete}>Calcular</button>
              </div>
              {frete?.error && <p className="text-xs text-red-600 mt-2">{frete.error}</p>}
              {frete?.price && (
                <p className="text-xs text-gray-700 mt-2">
                  Frete estimado: <b>{money(frete.price)}</b> • Prazo: {frete.eta} dias úteis
                </p>
              )}
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

        {/* CATEGORIAS (fixas – use os slugs que colocou no seed) */}
        <CategoriesBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

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
              brands={brandOptions}
              brand={brand}
              setBrand={setBrand}
              labelBySlug={brandNameBySlug}
            />
          </div>
        </section>

        {/* PRODUTOS */}
        <ProductGrid
          loading={loading}
          items={products}
          addToCart={addToCart}
          brandNameBySlug={brandNameBySlug}
        />
      </main>

      {/* CHATVOLT placeholder */}
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

function CategoriesBar({ activeCategory, setActiveCategory }) {
  // Use slugs que estão no seed/backend
  const categories = [
    { id: "higiene",   label: "Higiene",     emoji: "🧼" },
    { id: "limpeza",   label: "Limpeza",     emoji: "🧽" },
    { id: "chocolate", label: "Chocolate",   emoji: "🍫" },
    { id: "salgadinhos", label: "Salgadinhos", emoji: "🥟" },
    { id: "bebidas",   label: "Bebidas",     emoji: "🥤" },
    { id: "padaria",   label: "Padaria",     emoji: "🥐" },
    { id: "biscoitos", label: "Biscoitos",   emoji: "🍪" },
    { id: "infantil",  label: "Infantil",    emoji: "🍼" },
  ];

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Categorias</h2>
        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
          >
            Limpar filtro
          </button>
        )}
      </div>
      <div className="grid grid-rows-2 sm:grid-rows-2 grid-flow-col sm:grid-flow-col gap-3 overflow-x-auto sm:overflow-x-visible pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`min-w-[140px] sm:min-w-0 aspect-[3/1] rounded-xl border flex items-center justify-center gap-2 text-sm font-medium hover:shadow transition ${
              activeCategory === c.id ? "bg-blue-50 border-blue-200" : "bg-white"
            }`}
          >
            <span className="text-lg">{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BrandSelect({ brands, brand, setBrand, labelBySlug }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      Marca:
      <select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="px-2 py-1 rounded-md border"
      >
        {brands.map((slug) => (
          <option key={slug} value={slug}>
            {slug === "todas" ? "todas" : (labelBySlug?.(slug) || slug)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductGrid({ loading, items, addToCart, brandNameBySlug }) {
  return (
    <section className="mb-16">
      {loading && (
        <div className="text-center text-sm text-gray-500 py-6">
          Carregando produtos…
        </div>
      )}
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
              <div className="mt-1 text-xs text-gray-500">
                {brandNameBySlug?.(p.brandSlug) || p.brandName || p.brandSlug}
              </div>
              {p.promo && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">
                  Promoção
                </div>
              )}
              <button
                onClick={() => addToCart(p.price)}
                className="mt-3 w-full py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "var(--brand)" }}
              >
                Adicionar
              </button>
            </div>
          </article>
        ))}
      </div>
      {!loading && items.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-10">
          Nenhum produto encontrado com os filtros atuais.
        </div>
      )}
    </section>
  );
}
