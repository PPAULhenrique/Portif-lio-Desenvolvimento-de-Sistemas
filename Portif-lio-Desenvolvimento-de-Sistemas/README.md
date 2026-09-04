# Aviário Sonoro

Uma pequena rede social de observação de pássaros: crie um perfil, publique posts (com foto opcional), curta postagens, explore um catálogo de aves com foto, áudio e nome científico, e favorite os pássaros que mais gostar.

O projeto é feito inteiramente em **HTML, CSS e JavaScript puro** — sem framework de frontend, sem TypeScript, sem build, sem backend e sem banco de dados. Todos os dados (perfis, posts, likes e favoritos) ficam salvos no **`localStorage`** do próprio navegador.

## Tecnologias utilizadas

- HTML5, CSS3 e JavaScript (sem frameworks)
- `localStorage` do navegador, para persistência de dados
- Web Crypto API (`crypto.subtle`), para hash de senha
- API pública do [iNaturalist](https://api.inaturalist.org/v1/) (busca de fotos de aves, ao vivo, sem chave)

## Requisitos

- Um navegador atual (Chrome, Firefox, Edge ou similar)
- Não é necessário Node.js, npm, nem nenhuma instalação — o projeto não tem dependências

## Como instalar

Não há nada para instalar. O projeto é composto só por arquivos estáticos (`.html`, `.css`, `.js`) dentro da pasta `Site_gabriel/`. Basta ter os arquivos no seu computador.

## Como executar localmente

Duas formas, das mais simples às mais robustas:

**Opção 1 — Abrir direto no navegador**
Dê duplo clique em `Site_gabriel/hub.html` (ou clique direito → Abrir com → seu navegador).

**Opção 2 — Usar um servidor local simples (recomendado)**
Abrir arquivos direto pelo `file://` funciona para a maior parte do site, mas alguns navegadores restringem certas funcionalidades (como leitura de arquivos locais) fora de um servidor. Se notar algo estranho, use a extensão **Live Server** do VS Code:
1. Instale a extensão "Live Server" no VS Code.
2. Clique com o botão direito em `Site_gabriel/hub.html`.
3. Escolha "Open with Live Server".

## Como acessar o site

A porta de entrada é `hub.html` (o feed). A partir dele, a navegação pelo menu superior leva a:
- `catalogo.html` — catálogo de pássaros
- `perfil.html` — perfil do usuário logado (exige login/cadastro)
- `login.html` / `cadastro.html` — entrar ou criar um perfil

## Como funciona o armazenamento local

Tudo fica salvo em três chaves do `localStorage` do navegador (ver `armazenamento.js`):
- `aviario_usuarios` — lista de todos os perfis criados neste navegador
- `aviario_sessao` — qual usuário está logado agora
- `aviario_posts` — todos os posts

**Importante**: como é `localStorage`, os dados são específicos de **cada navegador em cada computador**. Limpar os dados do navegador (ou usar outro navegador/computador) apaga/esconde o que foi salvo. Não existe sincronização entre dispositivos.

## Como funciona o catálogo

O catálogo (`catalogo.js` + `especies.js`) mostra, para cada espécie, apenas: foto, áudio e nome científico.
- **Áudio**: arquivos MP3 locais, já incluídos no projeto (pasta `Audio de passaros/`).
- **Nome científico**: definido em `especies.js`, conferido manualmente.
- **Foto**: buscada ao vivo na API do iNaturalist a partir do nome científico; se a chamada falhar, usa uma foto local como reserva.

## Como as APIs são utilizadas

- **iNaturalist** (`https://api.inaturalist.org/v1/taxa`): usada só para buscar a foto de cada espécie, a partir do nome científico. Não exige chave.
- **Xeno-canto**: não está mais em uso. O site xeno-canto.org passou a bloquear pedidos automatizados (proteção anti-robô "Anubis/BotStopper"), então o áudio ao vivo por essa API parou de funcionar — os áudios do catálogo hoje são arquivos locais. A função que fazia essa busca está comentada em `catalogo.js`, caso volte a ser viável no futuro.

## Como criar um perfil

Acesse `cadastro.html`, preencha nome, nome de usuário, bio (opcional) e senha, e envie o formulário. Você é levado automaticamente para o seu perfil.

## Como criar uma postagem

No feed (`hub.html`), digite o texto na caixa de post e clique em "Publicar". É necessário ter um perfil criado (o formulário avisa se não houver ninguém logado).

## Como adicionar imagens aos posts

No mesmo formulário de post, use o campo "Adicionar foto (opcional)" antes de publicar. Uma prévia da imagem aparece antes de você enviar. A imagem é redimensionada automaticamente para não pesar demais no armazenamento local.

## Como curtir uma postagem

Clique no ícone de coração abaixo do post. Coração preenchido = você curtiu; clicar de novo remove a curtida. Cada usuário só pode contar 1 curtida por post.

## Como favoritar um pássaro

No catálogo, cada card tem um botão "☆ Favoritar" — clique para favoritar (o botão vira "★ Favoritado"); clique de novo para remover. É necessário estar logado.

## Como visualizar os favoritos no perfil

Acesse `perfil.html` — a seção "Pássaros favoritos" mostra a mesma lista de espécies do catálogo, com as favoritadas destacadas. Você também pode favoritar/desfavoritar diretamente por ali.

## Possíveis problemas e soluções

| Problema | Causa provável | Solução |
|---|---|---|
| Catálogo não mostra fotos | API do iNaturalist temporariamente fora do ar ou sem internet | O card usa a foto local como reserva automaticamente; se mesmo assim não aparecer nada, verifique sua conexão |
| Áudio não toca | Arquivo MP3 ausente ou navegador bloqueando autoplay | Clique diretamente no botão de play (não deve haver autoplay no site) |
| Perfil/posts "sumiram" | Dados do navegador foram limpos, ou você está em outro navegador/computador | Os dados são por navegador; não há como recuperar sem um backup manual do `localStorage` |
| Erro ao salvar post/imagem | `localStorage` do navegador está cheio | Remova posts antigos com imagem, ou use fotos menores |
