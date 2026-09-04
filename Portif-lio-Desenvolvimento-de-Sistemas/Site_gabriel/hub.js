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
const campoFotoPost = document.getElementById("imagemPost");
const previaImagemPost = document.getElementById("previaImagemPost");

let imagemPostSelecionada = null;

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
            ${post.imagemUrl ? `<img src="${post.imagemUrl}" alt="Foto da postagem">` : ""}
            <div class="acoes-post">
                <button type="button" class="botao-curtir ${jaCurtiu ? "curtido" : ""}" data-id="${post.id}" ${
            usuarioAtual ? "" : "disabled title='Crie um perfil para curtir'"
        }>
                    <svg viewBox="0 0 24 24" class="icone-coracao" aria-hidden="true">
                        <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.1 1.2 6.9 3.6 5.1c2.1-1.58 4.8-1.1 6.4.9.6.75 1.2 1.5 2 1.5s1.4-.75 2-1.5c1.6-2 4.3-2.48 6.4-.9 2.4 1.8 2.74 5 .93 7.7C18.7 16.65 12 21 12 21z"/>
                    </svg>
                    <span class="contagem-curtidas">${post.curtidas.length}</span>
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

if (campoFotoPost) {
    campoFotoPost.addEventListener("change", async () => {
        const arquivo = campoFotoPost.files[0];
        imagemPostSelecionada = null;
        previaImagemPost.hidden = true;

        if (!arquivo) return;

        try {
            validarArquivoDeImagem(arquivo);
            imagemPostSelecionada = await redimensionarImagem(arquivo);
            previaImagemPost.src = imagemPostSelecionada;
            previaImagemPost.hidden = false;
            mensagemPost.textContent = "";
        } catch (erro) {
            mensagemPost.textContent = erro.message;
            campoFotoPost.value = "";
        }
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

        criarPost(usuarioAtual, texto, imagemPostSelecionada);

        campoTexto.value = "";
        if (campoFotoPost) campoFotoPost.value = "";
        imagemPostSelecionada = null;
        previaImagemPost.hidden = true;
        mensagemPost.textContent = "";
        renderizarFeed();
    });
}

renderizarFeed();
