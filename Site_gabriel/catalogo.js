function tocarAudio(id) {
    const audio = document.getElementById(id);

    if (!audio) {
        return;
    }

    document.querySelectorAll("audio").forEach(function(outroAudio) {
        if (outroAudio !== audio) {
            outroAudio.pause();
            outroAudio.currentTime = 0;
        }
    });

    audio.play();
}
