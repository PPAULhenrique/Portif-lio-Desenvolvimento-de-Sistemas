// auth.js
// Cadastro e login usando o armazenamento local (armazenamento.js).
// Requer que armazenamento.js e cursor.js estejam incluidos ANTES deste
// arquivo no HTML.

const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");

if (formCadastro) {
    formCadastro.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const mensagem = document.getElementById("mensagemCadastro");
        const botao = formCadastro.querySelector("button[type='submit']");

        const dados = {
            nome: document.getElementById("cadastroNome").value.trim(),
            usuario: document
                .getElementById("cadastroUsuario")
                .value.trim()
                .replace(/\s+/g, "_"),
            bio: document.getElementById("cadastroBio").value.trim(),
            senha: document.getElementById("cadastroSenha").value,
        };

        botao.disabled = true;
        mensagem.textContent = "Criando perfil...";

        try {
            const usuarioCriado = await cadastrarUsuario(dados);
            iniciarSessao(usuarioCriado.id);
            mensagem.textContent = "Perfil criado! Abrindo sua pagina...";
            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 600);
        } catch (erro) {
            mensagem.textContent = erro.message;
            botao.disabled = false;
        }
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const mensagem = document.getElementById("mensagemLogin");
        const usuario = document.getElementById("loginUsuario").value.trim();
        const senha = document.getElementById("loginSenha").value;

        mensagem.textContent = "Verificando...";
        const usuarioEncontrado = await autenticarUsuario(usuario, senha);

        if (usuarioEncontrado) {
            iniciarSessao(usuarioEncontrado.id);
            mensagem.textContent = "Login aceito! Indo para o perfil...";
            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 600);
        } else {
            mensagem.textContent = "Usuario ou senha nao combinam.";
        }
    });
}
