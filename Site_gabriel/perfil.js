const usuarioSalvo = JSON.parse(localStorage.getItem("aviarioUsuario") || "null");

function iniciais(nome) {
    return nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase() || "AS";
}

if (usuarioSalvo) {
    const nomePerfil = document.getElementById("nomePerfil");
    const bioPerfil = document.getElementById("bioPerfil");
    const usuarioPerfil = document.getElementById("usuarioPerfil");
    const avatarPerfil = document.getElementById("avatarPerfil");
    const autorPost = document.getElementById("autorPost");

    nomePerfil.textContent = usuarioSalvo.nome;
    bioPerfil.textContent = usuarioSalvo.bio || "Novo membro do Aviario Sonoro.";
    usuarioPerfil.textContent = `@${usuarioSalvo.usuario}`;
    avatarPerfil.textContent = iniciais(usuarioSalvo.nome);
    autorPost.textContent = usuarioSalvo.nome;
}

const cursor = document.querySelector(".cursor");

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
