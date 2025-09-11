// src/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

const specs = ['unidade','pacote','caixa'];

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const empty = { name:'', price:'', spec:'unidade', imageUrl:'', promo:false, stock:100, categorySlug:'', brandSlug:'' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function loadAll() {
    const [items, brandsAdm, cats] = await Promise.all([
      api.admin.listProducts(q),
      api.admin.listBrands(),
      api.categories(),
    ]);
    setList(items);
    setBrands(brandsAdm);
    setCategories(cats);
  }

  useEffect(() => { loadAll().catch(console.error); }, [q]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock||0),
        promo: !!form.promo,
      };
      if (editingId) await api.admin.updateProduct(editingId, payload);
      else await api.admin.createProduct(payload);
      setForm(empty); setEditingId(null);
      await loadAll();
      setMsg('Salvo com sucesso.');
    } catch (err) {
      setMsg(err.message || String(err));
    } finally { setBusy(false); }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name, price: p.price, spec: p.spec, imageUrl: p.imageUrl || '',
      promo: !!p.promo, stock: p.stock,
      categorySlug: p.category?.slug || '',
      brandSlug: p.brand?.slug || ''
    });
  };

  const onDelete = async (id) => {
    if (!confirm('Excluir este produto?')) return;
    await api.admin.deleteProduct(id);
    await loadAll();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Produtos</h3>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-xl bg-white">
        <input className="border rounded-md px-2 py-1" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
        <input className="border rounded-md px-2 py-1" type="number" min="0" step="0.01" placeholder="Preço" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required />
        <select className="border rounded-md px-2 py-1" value={form.spec} onChange={e=>setForm(f=>({...f,spec:e.target.value}))}>
          {specs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <input className="border rounded-md px-2 py-1 md:col-span-2" placeholder="URL da imagem" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.promo} onChange={e=>setForm(f=>({...f,promo:e.target.checked}))} />
          Promoção
        </label>

        <input className="border rounded-md px-2 py-1" type="number" min="0" step="1" placeholder="Estoque" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />

        <select className="border rounded-md px-2 py-1" value={form.categorySlug} onChange={e=>setForm(f=>({...f,categorySlug:e.target.value}))} required>
          <option value="">Categoria…</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>

        <select className="border rounded-md px-2 py-1" value={form.brandSlug} onChange={e=>setForm(f=>({...f,brandSlug:e.target.value}))} required>
          <option value="">Marca…</option>
          {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
        </select>

        <div className="md:col-span-3 flex gap-2">
          <button disabled={busy} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
            {editingId ? 'Salvar alterações' : 'Criar produto'}
          </button>
          {editingId && (
            <button type="button" onClick={()=>{setEditingId(null); setForm(empty);}} className="px-4 py-2 rounded-md border">
              Cancelar
            </button>
          )}
          {msg && <span className="text-sm text-gray-600 ml-2">{msg}</span>}
        </div>
      </form>

      <div className="flex items-center gap-2">
        <input className="border rounded-md px-2 py-1" placeholder="Buscar por nome…" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={()=>setQ('')} className="px-3 py-1.5 rounded-md border">Limpar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(p => (
          <div key={p.id} className="p-3 border rounded-xl bg-white flex gap-3">
            <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="w-20 h-20 object-cover rounded-md border" />
            <div className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">
                {p.category?.name} • {p.brand?.name} • {p.spec} • R$ {Number(p.price).toFixed(2)} {p.promo && <span className="text-green-700 ml-1">Promo</span>}
              </div>
              <div className="text-xs text-gray-500">Estoque: {p.stock}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>onEdit(p)} className="px-3 py-1.5 rounded-md border">Editar</button>
              <button onClick={()=>onDelete(p.id)} className="px-3 py-1.5 rounded-md border text-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
