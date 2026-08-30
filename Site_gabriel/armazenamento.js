// armazenamento.js
// Camada unica de dados do Aviario Sonoro.
// Tudo fica gravado no localStorage do proprio navegador do usuario -
// nao existe backend nem banco de dados nesta versao do projeto.
//
// Inclua este arquivo ANTES dos outros scripts da pagina, assim:
// <script src="armazenamento.js"></script>
// <script src="hub.js"></script>

const CHAVE_USUARIOS = "aviario_usuarios";
const CHAVE_SESSAO = "aviario_sessao";
const CHAVE_POSTS = "aviario_posts";

// ---------- Utilidades ----------

function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Evita que texto digitado pelo usuario vire HTML/JS quando exibido na tela.
function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Gera um hash da senha usando a Web Crypto API do proprio navegador.
// Isso evita guardar a senha em texto puro no localStorage.
// Importante: como nao existe servidor, isso NAO substitui uma autenticacao
// real de producao - serve para nao deixar a senha "a vista" no navegador
// de quem esta usando o site localmente.
async function gerarHashSenha(senha) {
    const dados = new TextEncoder().encode(senha);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function iniciais(nome) {
    return (
        (nome || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((parte) => parte[0])
            .join("")
            .toUpperCase() || "AS"
    );
}

// ---------- Usuarios ----------

function listarUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || "[]");
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

async function cadastrarUsuario({ nome, usuario, bio, senha }) {
    if (!nome || !usuario || !senha) {
        throw new Error("Preencha nome, usuario e senha.");
    }

    const usuarios = listarUsuarios();

    if (usuarios.some((u) => u.usuario === usuario)) {
        throw new Error("Esse nome de usuario ja existe. Escolha outro.");
    }

    const novoUsuario = {
        id: gerarId(),
        nome,
        usuario,
        bio: bio || "",
        senhaHash: await gerarHashSenha(senha),
        criadoEm: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    return novoUsuario;
}

async function autenticarUsuario(usuario, senha) {
    const usuarios = listarUsuarios();
    const senhaHash = await gerarHashSenha(senha);
    return usuarios.find((u) => u.usuario === usuario && u.senhaHash === senhaHash) || null;
}

function buscarUsuarioPorId(id) {
    return listarUsuarios().find((u) => u.id === id) || null;
}

// ---------- Sessao (quem esta logado neste navegador agora) ----------

function iniciarSessao(usuarioId) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ usuarioId }));
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
}

function usuarioLogado() {
    const sessao = JSON.parse(localStorage.getItem(CHAVE_SESSAO) || "null");
    if (!sessao) return null;
    return buscarUsuarioPorId(sessao.usuarioId);
}

// ---------- Posts ----------

function listarPosts() {
    const posts = JSON.parse(localStorage.getItem(CHAVE_POSTS) || "[]");
    return posts.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
}

function salvarPosts(posts) {
    localStorage.setItem(CHAVE_POSTS, JSON.stringify(posts));
}

function criarPost(autor, texto) {
    const posts = listarPosts();
    const novoPost = {
        id: gerarId(),
        autorId: autor.id,
        autorNome: autor.nome,
        autorUsuario: autor.usuario,
        texto,
        criadoEm: new Date().toISOString(),
        curtidas: [], // guarda os IDs de quem curtiu, para nao deixar curtir 2x
    };
    posts.push(novoPost);
    salvarPosts(posts);
    return novoPost;
}

// Curtir/descurtir. Impede que o mesmo usuario conte 2 curtidas no mesmo post.
function alternarLike(postId, usuarioId) {
    const posts = listarPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    const jaCurtiu = post.curtidas.includes(usuarioId);
    post.curtidas = jaCurtiu
        ? post.curtidas.filter((id) => id !== usuarioId)
        : [...post.curtidas, usuarioId];

    salvarPosts(posts);
    return post;
}

function postsDoUsuario(usuarioId) {
    return listarPosts().filter((p) => p.autorId === usuarioId);
}
