// src/admin/AdminBrands.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function AdminBrands() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', slug:'', logoUrl:'' });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setList(await api.admin.listBrands());
  }
  useEffect(()=>{ load().catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await api.admin.updateBrand(editingId, form);
    else await api.admin.createBrand(form);
    setForm({ name:'', slug:'', logoUrl:'' });
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Marcas</h3>
      <form onSubmit={submit} className="flex flex-wrap gap-3 p-4 border rounded-xl bg-white">
        <input className="border rounded-md px-2 py-1" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
        <input className="border rounded-md px-2 py-1" placeholder="slug" value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} required />
        <input className="border rounded-md px-2 py-1 min-w-[300px]" placeholder="Logo URL" value={form.logoUrl} onChange={e=>setForm(f=>({...f,logoUrl:e.target.value}))} />
        <button className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
          {editingId ? 'Salvar' : 'Criar'}
        </button>
        {editingId && <button type="button" className="px-4 py-2 rounded-md border" onClick={()=>{setEditingId(null); setForm({name:'',slug:'',logoUrl:''});}}>Cancelar</button>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(b => (
          <div key={b.id} className="p-3 border rounded-xl bg-white flex items-center gap-3">
            <img src={b.logoUrl || '/placeholder.png'} alt={b.name} className="w-16 h-16 object-contain rounded-md border bg-white" />
            <div className="flex-1">
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-gray-500">{b.slug}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md border" onClick={()=>{setEditingId(b.id); setForm({ name:b.name, slug:b.slug, logoUrl:b.logoUrl||'' });}}>Editar</button>
              <button className="px-3 py-1.5 rounded-md border text-red-600" onClick={async()=>{ if(confirm('Excluir?')) { await api.admin.deleteBrand(b.id); await load(); }}}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
