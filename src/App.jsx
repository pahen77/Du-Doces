import { useEffect, useMemo, useState } from "react";
import "./index.css";

/** ===== Dados base (pode trocar por fetch('/products.json')) ===== */
const CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "balas", label: "Balas" },
  { id: "chicletes", label: "Chicletes" },
  { id: "chocolates", label: "Chocolates" },
  { id: "outros", label: "Outros" },
];

const BRANDS = [
  { id: "todas", label: "Todas as Marcas", logo: "" },
  { id: "arcor", label: "Arcor", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Arcor_logo.png" },
  { id: "nestle", label: "Nestlé", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nestle_textlogo_blue.svg" },
  { id: "bauducco", label: "Bauducco", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Bauducco_logo.png" },
  { id: "haribo", label: "Haribo", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Haribo_logo.svg" },
  { id: "santafe", label: "Santa Fe", logo: "" },
  { id: "dori", label: "Dori", logo: "" },
  { id: "soberana", label: "Soberana", logo: "" },
  { id: "primor", label: "Primor", logo: "" },
  { id: "chita", label: "Chita", logo: "" },
  { id: "ourolux", label: "Ourolux", logo: "" },
  { id: "lacta", label: "Lacta", logo: "" },
  { id: "garoto", label: "Garoto", logo: "" },
  { id: "copag", label: "Copag", logo: "" },
  { id: "trident", label: "Trident", logo: "" },
];

const FALLBACK_IMG = {
  balas: "https://images.unsplash.com/photo-1606857521015-7f8bea6a853e?q=80&w=800&auto=format&fit=crop",
  chicletes: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop",
  chocolates: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
  outros: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
};

const MOCK_PRODUCTS = [
  { id: 101, name: "Bala Pipper Dura", brand: "santafe", category: "balas", price: 6.95, unit: "pacote" },
  { id: 102, name: "Bala Pipper Mastigável", brand: "santafe", category: "balas", price: 5.95, unit: "pacote" },
  { id: 103, name: "Bala de Mel", brand: "dori", category: "balas", price: 8.99, unit: "pacote" },
  { id: 104, name: "Bala Gengibre e Mel", brand: "soberana", category: "balas", price: 7.95, unit: "pacote" },
  { id: 105, name: "Bala de Mel", brand: "arcor", category: "balas", price: 15.5, unit: "pacote" },
  { id: 106, name: "Bala de Banana", brand: "primor", category: "balas", price: 15.75, unit: "pacote" },
  { id: 107, name: "Bala Sortida", brand: "chita", category: "balas", price: 7.6, unit: "pacote" },
  { id: 108, name: "Lâmpada 9W", brand: "ourolux", category: "outros", price: 2.99, unit: "unidade" },
  { id: 109, name: "Suflair unidade", brand: "nestle", category: "chocolates", price: 4.99, unit: "unidade" },
  { id: 110, name: "Suflair caixa", brand: "nestle", category: "chocolates", price: 99.5, unit: "caixa" },
  { id: 111, name: "Kitkat unidade", brand: "nestle", category: "chocolates", price: 2.99, unit: "unidade" },
  { id: 112, name: "Kitkat caixa", brand: "nestle", category: "chocolates", price: 71.75, unit: "caixa" },
  { id: 113, name: "Chocolate Block unidade", brand: "arcor", category: "chocolates", price: 1.75, unit: "unidade" },
  { id: 114, name: "Chocolate Block caixa", brand: "arcor", category: "chocolates", price: 32.5, unit: "caixa" },
  { id: 115, name: "Sonho de Valsa pacote", brand: "lacta", category: "chocolates", price: 53.95, unit: "pacote" },
  { id: 116, name: "Ouro Branco pacote", brand: "lacta", category: "chocolates", price: 53.95, unit: "pacote" },
  { id: 117, name: "Serenata de Amor pacote", brand: "garoto", category: "chocolates", price: 49.95, unit: "pacote" },
  { id: 118, name: "Bon o Bon brigadeiro", brand: "arcor", category: "chocolates", price: 39.95, unit: "pacote" },
  { id: 119, name: "Bon o Bon morango", brand: "arcor", category: "chocolates", price: 39.95, unit: "pacote" },
  { id: 120, name: "Bon o Bon beijinho", brand: "arcor", category: "chocolates", price: 39.95, unit: "pacote" },
  { id: 121, name: "Baralho Copag (unidade)", brand: "copag", category: "outros", price: 11.5, unit: "unidade" },
  { id: 122, name: "Baralho Copag (caixa)", brand: "copag", category: "outros", price: 138.0, unit: "caixa" },
  { id: 123, name: "Trident caixa Menta", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 124, name: "Trident caixa Hortelã", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 125, name: "Trident caixa Tutti Frutti", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 126, name: "Trident caixa Blueberry", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 127, name: "Trident caixa Intense", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 128, name: "Trident caixa Cereja Ice", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 129, name: "Trident caixa Herbal", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 130, name: "Trident caixa Melancia", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 131, name: "Trident caixa Canela", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
  { id: 132, name: "Trident caixa Morango", brand: "trident", category: "chicletes", price: 35.7, unit: "caixa" },
];

const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function App() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("todas");
  const [cat, setCat] = useState("todas");
  const [sort, setSort] = useState("relevancia");
  const [promoOnly, setPromoOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cep, setCep] = useState(localStorage.getItem("cep") || "");
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  // Banners (carrossel simples)
  const [banner, setBanner] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBanner((b) => (b + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  // Persist CEP
  useEffect(() => { localStorage.setItem("cep", cep); }, [cep]);

  const filtered = useMemo(() => {
    let items = products.filter(
      (p) =>
        (cat === "todas" || p.category === cat) &&
        (brand === "todas" || p.brand === brand) &&
        (!promoOnly || p.promo) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "preco_asc") items = items.slice().sort((a, b) => a.price - b.price);
    if (sort === "preco_desc") items = items.slice().sort((a, b) => b.price - a.price);
    return items;
  }, [products, cat, brand, promoOnly, search, sort]);

  const totalQty = cart.reduce((a, b) => a + b.qty, 0);
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);

  function addToCart(p) {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = c.slice();
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
        }
      return [...c, { ...p, qty: 1 }];
    });
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id);
      if (i < 0) return c;
      const next = c.slice();
      const q = next[i].qty + delta;
      if (q <= 0) next.splice(i, 1);
      else next[i] = { ...next[i], qty: q };
      return next;
    });
  }

  return (
    <div className="page">
      {/* linhas/arte de fundo */}
      <div className="blue-lines" />

      {/* Header */}
      <header className="header">
        <div className="topbar">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <span />
          </button>
          <div className="brand">
            <h1><span>DU</span> DOCES</h1>
            <small className="subtitle">Distribuidora</small>
          </div>
          <div className="search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produtos..." />
          </div>
          <button className="login-btn" onClick={() => setLoginOpen(true)}>Login</button>
          <div className="cart-cep">
            <div className="cep-input" title="Informe seu CEP">
              <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" maxLength={9} />
            </div>
            <button className="cart" onClick={() => setDrawerOpen(true)} aria-label="Abrir carrinho">
              <span className="badge">{totalQty}</span> 🛒
            </button>
          </div>
        </div>
      </header>

      {/* Drawer menu */}
      {menuOpen && (
        <div className="drawer open" onClick={() => setMenuOpen(false)}>
          <div className="backdrop" />
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <h3>Menu</h3>
            <a href="#" onClick={() => setLoginOpen(true)}>Login</a>
            <a href="#">Sobre nós</a>
            <a href="#">Configurações</a>
            <a href="#">Política de Entrega</a>
            <a href="#">Atendimento</a>
          </div>
        </div>
      )}

      {/* Banners */}
      <section className="banners" aria-label="Destaques">
        <div className="banner-track" style={{ transform: `translateX(-${banner * 100}%)` }}>
          <div className="banner banner-1" />
          <div className="banner banner-2" />
          <div className="banner banner-3" />
        </div>
        <div className="banner-dots">
          {[0, 1, 2].map((i) => (
            <button key={i} className={i === banner ? "active" : ""} onClick={() => setBanner(i)} />
          ))}
        </div>
      </section>

      {/* Filtros */}
      <section className="filters">
        {/* Marcas */}
        <div className="brand-row">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              className={`brand-btn ${brand === b.id ? "active" : ""}`}
              onClick={() => setBrand(b.id)}
              title={b.label}
            >
              {b.logo ? <img src={b.logo} alt={b.label} /> : null}
              <strong>{b.id === "todas" ? "Todas as Marcas" : b.label}</strong>
            </button>
          ))}
        </div>
        {/* Toolbar */}
        <div className="toolbar">
          <label className="select">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevancia">Ordenar por: Relevância</option>
              <option value="preco_asc">Menor preço</option>
              <option value="preco_desc">Maior preço</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={promoOnly} onChange={(e) => setPromoOnly(e.target.checked)} />
            Somente promoções
          </label>
        </div>
        {/* Categorias */}
        <div className="chip-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              data-cat={c.id}
              className={`chip ${cat === c.id ? "active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.id === "chicletes" ? "🍬 Chicletes" : c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Produtos */}
      <main className="container">
        <div className="grid">
          {filtered.map((p) => {
            const src = p.img || FALLBACK_IMG[p.category] || FALLBACK_IMG.outros;
            return (
              <div className="card" key={p.id}>
                <div className="thumb">
                  <img src={src} alt={p.name} loading="lazy" />
                </div>
                <div className="body">
                  <div className="title">{p.name}</div>
                  <div className="brand-tag">{p.brand.toUpperCase()} • {p.unit}</div>
                  <div className="price">{fmtBRL(p.price)}</div>
                  <button className="add" onClick={() => addToCart(p)}>Adicionar</button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Carrinho */}
      <aside className={`cart-drawer ${drawerOpen ? "open" : ""}`} aria-label="Carrinho">
        <header>
          <strong>Carrinho</strong>
          <button className="btn" onClick={() => setDrawerOpen(false)}>Fechar</button>
        </header>
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="cart-empty">Seu carrinho está vazio</div>
          ) : (
            cart.map((i) => {
              const src = i.img || FALLBACK_IMG[i.category] || FALLBACK_IMG.outros;
              return (
                <div className="cart-item" key={i.id}>
                  <img src={src} alt={i.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{i.name}</div>
                    <div style={{ opacity: .8, fontSize: 12 }}>
                      {i.brand.toUpperCase()} • {fmtBRL(i.price)} / {i.unit}
                    </div>
                  </div>
                  <div className="qty">
                    <button onClick={() => changeQty(i.id, -1)}>-</button>
                    <strong className="q">{i.qty}</strong>
                    <button onClick={() => changeQty(i.id, 1)}>+</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-footer">
          <div className="row"><span>CEP:</span><strong>{cep || "—"}</strong></div>
          <div className="row"><span>Total:</span><strong>{fmtBRL(total)}</strong></div>
          <button className="checkout" disabled={cart.length === 0}>Finalizar Pedido</button>
        </div>
      </aside>

      {/* Modal Login */}
      {loginOpen && (
        <div className="modal open" onClick={() => setLoginOpen(false)}>
          <div className="box" onClick={(e) => e.stopPropagation()}>
            <h3>Login</h3>
            <div className="field">
              <label>E-mail</label>
              <input type="email" placeholder="seuemail@dudoces.com" />
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="actions">
              <button className="btn" onClick={() => setLoginOpen(false)}>Cancelar</button>
              <button className="btn primary" onClick={() => { alert("Login mockado"); setLoginOpen(false); }}>Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ChatVolt placeholder */}
      <div className="chatvolt-dock">
        <div className="chatvolt-bubble" onClick={() => alert("Substitua pelo widget oficial do ChatVolt")}>IA</div>
      </div>

      {/* Rodapé */}
      <footer>
        <div className="site-footer">Du Doces Distribuidora LTDA — todos os direitos reservados.</div>
      </footer>
    </div>
  );
}
