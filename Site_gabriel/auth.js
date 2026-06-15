const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");
const cursor = document.querySelector(".cursor");

function salvarUsuario(dados) {
    localStorage.setItem("aviarioUsuario", JSON.stringify(dados));
}

function buscarUsuario() {
    return JSON.parse(localStorage.getItem("aviarioUsuario") || "null");
}

if (formCadastro) {
    formCadastro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const usuario = {
            nome: document.getElementById("cadastroNome").value.trim(),
            usuario: document.getElementById("cadastroUsuario").value.trim().replace(/\s+/g, "_"),
            bio: document.getElementById("cadastroBio").value.trim(),
            senha: document.getElementById("cadastroSenha").value
        };

        salvarUsuario(usuario);
        document.getElementById("mensagemCadastro").textContent = "Perfil criado! Abrindo sua pagina...";

        setTimeout(() => {
            window.location.href = "perfil.html";
        }, 700);
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const usuario = buscarUsuario();
        const loginUsuario = document.getElementById("loginUsuario").value.trim();
        const loginSenha = document.getElementById("loginSenha").value;
        const mensagem = document.getElementById("mensagemLogin");

        if (!usuario) {
            mensagem.textContent = "Crie um perfil antes de entrar.";
            return;
        }

        if (loginUsuario === usuario.usuario && loginSenha === usuario.senha) {
            mensagem.textContent = "Login aceito! Indo para o perfil...";
            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 700);
        } else {
            mensagem.textContent = "Usuario ou senha nao combinam.";
        }
    });
}

document.addEventListener("mousemove", (evento) => {
    cursor.style.left = `${evento.clientX}px`;
    cursor.style.top = `${evento.clientY}px`;
});

document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
});

document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
});
