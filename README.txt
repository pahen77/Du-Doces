Du Doces — Front‑end (Sprint 1–2)
=================================

Este diretório contém uma versão atualizada do front‑end da Du Doces,
com todas as melhorias solicitadas durante a primeira sprint:

* Cabeçalho vermelho com logotipo centralizado, ícone de login ao lado do campo CEP e carrinho.
* Seções para marcas e categorias independentes, com filtros de marca que desmarcam a categoria automaticamente se não houver produtos.
* Banner decorativo no topo com mensagem de boas‑vindas.
* Cartões de produto mais largos com fotos genéricas para cada categoria. Quando uma imagem existe, ela é exibida; caso contrário, usa‑se um emoji.
* Sistema de carrinho completo (adicionar, alterar quantidade, remover e limpar). Os itens são salvos no `localStorage`.
* Lista de desejos (favoritos) com botão de coração em cada produto e opção de visualizar/remover itens favoritos no menu lateral.
* Botões de ordenação e seleção do item mais barato da categoria, da loja ou de paçoca.
* Páginas adicionais: `login.html` (formulário de login) e `sobre.html` (informações da empresa, fundação, lojas físicas e contato).
* Integração com ChatVolt via script no fim do `index.html` (inicia automaticamente na primeira visita e pode ser reaberto pelo menu).

Como executar localmente
-----------------------
Como este é um site puramente estático, basta abrir `index.html` no navegador para ver a interface.
Se desejar servir via um servidor HTTP, você pode usar o `http-server` do Node.js ou qualquer servidor estático.

Próximos passos sugeridos
-------------------------
1. **Backend de produtos**: implementar uma API REST com Node/Express (ou outra stack) que responda a `GET /products` e permita CRUD de produtos. O front já está preparado para consumir esses dados; para isso, basta substituir o array `PRODUCTS` por uma chamada `fetch` no script.
2. **Integração da lista de desejos com backend**: você pode criar endpoints para salvar e recuperar favoritos por usuário autenticado.
3. **Login e checkout**: a página de login é apenas um mock. Conecte‑a ao backend com autenticação JWT e implemente um endpoint `/orders` para finalizar compras.
4. **SEO, responsividade e testes**: revise metatags, verifique a renderização em dispositivos móveis e adicione testes automatizados conforme necessário.
5. **Entrega contínua**: configure deploy automático (Vercel, Netlify, etc.) e variables de ambiente para apontar o front ao backend em produção.

Observação: as imagens utilizadas aqui são genéricas e estão inclusas neste pacote. Substitua por fotos reais de produtos em um servidor CDN quando disponível.