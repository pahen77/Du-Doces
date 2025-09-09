# Du Doces — Frontend (Vite + React + Tailwind)

## Como rodar
```bash
npm install
npm run dev
```

Abra o link mostrado no terminal (ex.: http://localhost:5173).

## Onde editar conteúdo
- **Cor da marca**: `src/index.css` (variável `--brand`).
- **Banners**: `public/banners.json`.
- **Produtos (100 itens)**: `public/products.json`.
  - Campos: `id`, `name`, `price`, `spec`, `brand`, `category`, `promo`, `image`.
  - Dica: use apenas imagens em `/public/images/` ou URLs externas.

## CEP / Frete
Há um **estimador de frete** de exemplo no menu lateral (placeholder). Quando formos integrar a API oficial (Correios, Melhor Envio, Kangu etc.), basta substituir a função `estimateFrete` em `src/App.jsx` por uma chamada HTTP ao serviço escolhido.

## Próximos passos sugeridos (resumo)
1. Camada de **autenticação** (e-mail/senha, social).
2. **Catálogo** consumindo **API real** (Node/Express + Prisma + PostgreSQL).
3. **Carrinho persistente** (localStorage + backend).
4. **Checkout** (Pix/Cartão) via Mercado Pago/Stripe/Pagar.me.
5. **Cálculo de frete real** (Correios/Melhor Envio) com rastreio.
6. **Admin** (CRUD de produtos, categorias, marcas, promoções, estoque).
7. **CMS leve** para banners, páginas institucionais e SEO.
8. Observabilidade (logs/erros) e **analytics** (evento de funil).
9. **Testes** (unitários e E2E) e **CI/CD** (Vercel/Netlify/Render).
