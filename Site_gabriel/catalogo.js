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