const frases = [
    "Hoje o catalogo esta pronto para cantar.",
    "Escolha uma ave e deixe o site fazer barulho.",
    "As penas sao coloridas, mas a personalidade e mais ainda."
];

const fraseDoDia = document.getElementById("frase-do-dia");

if (fraseDoDia) {
    const indice = new Date().getDay() % frases.length;
    fraseDoDia.textContent = frases[indice];
}
