// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/,'') || '';

let _token = localStorage.getItem('token') || '';
export function setToken(t) { _token = t || ''; localStorage.setItem('token', _token); }
export function getToken() { return _token; }

async function http(path, { method='GET', auth=false, json, params } = {}) {
  const url = new URL(BASE + path);
  if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const headers = { };
  if (auth && _token) headers['Authorization'] = `Bearer ${_token}`;
  let body;
  if (json) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(json); }
  const r = await fetch(url, { method, headers, body, credentials: 'include' });
  if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || r.statusText);
  return r.json();
}

// Auth
export const api = {
  login: (email, password) => http('/auth/login', { method:'POST', json:{ email, password } }),
  me: () => http('/me', { auth:true }),

  // públicas
  categories: () => http('/categories'),
  brands: () => http('/brands'),
  products: (params) => http('/products', { params }),

  // admin
  admin: {
    listBrands: () => http('/admin/brands', { auth:true }),
    createBrand: (payload) => http('/admin/brands', { method:'POST', auth:true, json: payload }),
    updateBrand: (id, payload) => http(`/admin/brands/${id}`, { method:'PUT', auth:true, json: payload }),
    deleteBrand: (id) => http(`/admin/brands/${id}`, { method:'DELETE', auth:true }),

    listProducts: (q) => http('/admin/products', { auth:true, params: q ? { q } : undefined }),
    createProduct: (payload) => http('/admin/products', { method:'POST', auth:true, json: payload }),
    updateProduct: (id, payload) => http(`/admin/products/${id}`, { method:'PUT', auth:true, json: payload }),
    deleteProduct: (id) => http(`/admin/products/${id}`, { method:'DELETE', auth:true }),
  }
};
