// cursor.js
// Efeito de cursor customizado (imagem de passaro seguindo o mouse).
// Antes esse mesmo bloco de codigo estava copiado em hub.js, auth.js,
// perfil.js e catalogo.js. Agora existe em um unico lugar.
//
// Inclua em toda pagina que tiver um elemento <div class="cursor"></div>:
// <script src="cursor.js"></script>

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

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
});
