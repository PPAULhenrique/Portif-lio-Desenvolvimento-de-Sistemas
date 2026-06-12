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

const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });