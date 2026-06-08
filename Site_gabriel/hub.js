const frases = [
    "Hoje o catalogo esta pronto para cantar.",
    "Escolha uma ave e deixe sua família para sempre.",
    "As penas sao coloridas, mas o meu cu é mais ainda."
];

const fraseDoDia = document.getElementById("frase-do-dia");

if (fraseDoDia) {
    const indice = new Date().getDay() % frases.length;
    fraseDoDia.textContent = frases[indice];
}
