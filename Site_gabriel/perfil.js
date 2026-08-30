// perfil.js
// Mostra os dados reais do usuario logado e os posts que ele mesmo criou.
// Requer armazenamento.js e cursor.js incluidos ANTES deste arquivo.

const usuarioAtual = usuarioLogado();

if (!usuarioAtual) {
    // Ninguem logado neste navegador: manda para o login em vez de
    // mostrar um perfil fictício.
    window.location.href = "login.html";
} else {
    document.getElementById("nomePerfil").textContent = usuarioAtual.nome;
    document.getElementById("bioPerfil").textContent =
        usuarioAtual.bio || "Esse usuario ainda nao escreveu uma bio.";
    document.getElementById("usuarioPerfil").textContent = `@${usuarioAtual.usuario}`;
    document.getElementById("avatarPerfil").textContent = iniciais(usuarioAtual.nome);

    const meusPosts = postsDoUsuario(usuarioAtual.id);
    const contagemPosts = document.getElementById("contagemPosts");
    if (contagemPosts) contagemPosts.textContent = meusPosts.length;

    const colunaPosts = document.getElementById("colunaPosts");
    colunaPosts.innerHTML = "";

    if (meusPosts.length === 0) {
        colunaPosts.innerHTML =
            "<p>Voce ainda nao publicou nada. Va ate o feed e cante alguma coisa!</p>";
    } else {
        meusPosts.forEach((post) => {
            const artigo = document.createElement("article");
            artigo.className = "post";
            artigo.innerHTML = `
                <div class="topo-post">
                    <div class="avatar">${iniciais(usuarioAtual.nome)}</div>
                    <div><strong>${escaparHTML(usuarioAtual.nome)}</strong></div>
                </div>
                <p>${escaparHTML(post.texto)}</p>
                <div class="acoes-post">
                    <span>${post.curtidas.length} curtida(s)</span>
                </div>
            `;
            colunaPosts.appendChild(artigo);
        });
    }
}

const botaoSair = document.getElementById("botaoSair");
if (botaoSair) {
    botaoSair.addEventListener("click", () => {
        encerrarSessao();
        window.location.href = "hub.html";
    });
}
