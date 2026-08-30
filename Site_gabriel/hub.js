// hub.js
// Feed real do Aviario Sonoro: le e grava posts no localStorage.
// Requer armazenamento.js e cursor.js incluidos ANTES deste arquivo.

const frases = [
    "Hoje o catalogo esta pronto para cantar.",
    "Escolha uma ave e entre no feed do Aviario.",
    "As penas sao coloridas, e o feed tambem.",
];

const usuarioAtual = usuarioLogado();
const listaFeed = document.getElementById("listaFeed");
const formNovoPost = document.getElementById("formNovoPost");
const mensagemPost = document.getElementById("mensagemPost");
const fraseDoDia = document.getElementById("frase-do-dia");

if (fraseDoDia) {
    fraseDoDia.textContent = frases[new Date().getDay() % frases.length];
}

// Mini-perfil da barra lateral
if (usuarioAtual) {
    document.getElementById("nomeHub").textContent = usuarioAtual.nome;
    document.getElementById("usuarioHub").textContent = `@${usuarioAtual.usuario}`;
    document.getElementById("avatarHub").textContent = iniciais(usuarioAtual.nome);
}

function renderizarFeed() {
    const posts = listarPosts();
    listaFeed.innerHTML = "";

    if (posts.length === 0) {
        listaFeed.innerHTML = "<p>Nenhuma postagem ainda. Seja o primeiro a cantar!</p>";
        return;
    }

    posts.forEach((post) => {
        const jaCurtiu = Boolean(usuarioAtual) && post.curtidas.includes(usuarioAtual.id);

        const artigo = document.createElement("article");
        artigo.className = "post";
        artigo.innerHTML = `
            <div class="topo-post">
                <div class="avatar">${iniciais(post.autorNome)}</div>
                <div>
                    <strong>${escaparHTML(post.autorNome)}</strong>
                    <span>@${escaparHTML(post.autorUsuario)}</span>
                </div>
            </div>
            <p>${escaparHTML(post.texto)}</p>
            <div class="acoes-post">
                <button type="button" class="botao-curtir" data-id="${post.id}" ${
            usuarioAtual ? "" : "disabled title='Crie um perfil para curtir'"
        }>
                    ${jaCurtiu ? "Descurtir" : "Curtir"} (${post.curtidas.length})
                </button>
            </div>
        `;
        listaFeed.appendChild(artigo);
    });

    listaFeed.querySelectorAll(".botao-curtir").forEach((botao) => {
        botao.addEventListener("click", () => {
            if (!usuarioAtual) return;
            alternarLike(botao.dataset.id, usuarioAtual.id);
            renderizarFeed();
        });
    });
}

if (formNovoPost) {
    formNovoPost.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!usuarioAtual) {
            mensagemPost.textContent = "Crie um perfil para poder publicar.";
            return;
        }

        const campoTexto = document.getElementById("textoPost");
        const texto = campoTexto.value.trim();
        if (!texto) return;

        criarPost(usuarioAtual, texto);
        campoTexto.value = "";
        mensagemPost.textContent = "";
        renderizarFeed();
    });
}

renderizarFeed();
