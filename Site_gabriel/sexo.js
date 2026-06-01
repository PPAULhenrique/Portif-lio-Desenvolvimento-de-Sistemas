function tocarAudio() {
    const audio = document.getElementById("meuAudio");
    audio.play();
}

function pausarAudio() {
    const audio = document.getElementById("meuAudio");
    audio.pause();
}

function tocarAudio(id) {
    document.getElementById(id).play();
}