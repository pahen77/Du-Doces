// src/admin/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { api, setToken, getToken } from '../lib/api';
import AdminProducts from './AdminProducts';
import AdminBrands from './AdminBrands';

export default function AdminPanel({ open, onClose }) {
  const [tab, setTab] = useState('produtos');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loadMe() {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch { setUser(null); }
  }
  useEffect(()=>{ if (open) loadMe(); }, [open]);

  const doLogin = async (e) => {
    e.preventDefault();
    const r = await api.login(email, password);
    setToken(r.token);
    await loadMe();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full md:w-[860px] bg-gray-50 shadow-2xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Admin</h2>
          <button className="p-2 rounded-md hover:bg-gray-200" onClick={onClose}>Fechar</button>
        </div>

        {!user && (
          <form onSubmit={doLogin} className="max-w-sm p-4 border rounded-xl bg-white space-y-3">
            <input className="border rounded-md px-2 py-1 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="border rounded-md px-2 py-1 w-full" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Entrar</button>
            {getToken() && <p className="text-xs text-gray-500">Token salvo no navegador.</p>}
          </form>
        )}

        {user && (
          <>
            <div className="flex gap-2 mb-4">
              <button onClick={()=>setTab('produtos')} className={`px-3 py-1.5 rounded-md border ${tab==='produtos'?'bg-white shadow':''}`}>Produtos</button>
              <button onClick={()=>setTab('marcas')} className={`px-3 py-1.5 rounded-md border ${tab==='marcas'?'bg-white shadow':''}`}>Marcas</button>
            </div>
            {tab==='produtos' ? <AdminProducts/> : <AdminBrands/>}
          </>
        )}
      </div>
    </div>
  );
}
