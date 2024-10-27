let isAnimating = false;
const videoElement = document.getElementById('growthVideo');
const videoDuration = 8; // La duración total del video en segundos para el crecimiento completo

function calculateC(H, h0) {
    return 1 - (h0 / H);
}

function calculateK(H, growthPerYear) {
    return -Math.log(1 - (growthPerYear / H));
}

function calculateHeight(t, H, h0, growthPerYear) {
    const C = calculateC(H, h0);
    const k = calculateK(H, growthPerYear);
    return H * (1 - C * Math.exp(-k * t));
}

function simulateGrowth() {
    if (isAnimating) return;

    const H = parseFloat(document.getElementById('maxHeight').value);
    const h0 = parseFloat(document.getElementById('initialHeight').value);
    const years = parseFloat(document.getElementById('years').value);
    const growthPerYear = parseFloat(document.getElementById('growthPerYear').value);

    if (h0 >= H) {
        alert('La altura inicial debe ser menor que la altura máxima');
        return;
    }

    isAnimating = true;
    const simulateButton = document.querySelector('button');
    simulateButton.disabled = true;

    const finalHeight = calculateHeight(years, H, h0, growthPerYear);
    const growth = finalHeight - h0;

    document.getElementById('initialHeightDisplay').textContent = 
        `Altura inicial: ${h0.toFixed(2)} metros`;

    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';

    // Calcula la fracción del video donde debe estar basado en la altura final
    const growthRatio = finalHeight / H;
    const videoTargetTime = growthRatio * videoDuration; // Proporción del tiempo del video

    // Establece la velocidad del video para que dure el tiempo exacto hasta que crezca por completo
    const videoSpeed = videoTargetTime / videoDuration;

    // Reinicia el video y ajusta la velocidad de reproducción
    videoElement.currentTime = 0; // Comienza desde el inicio del video
    videoElement.playbackRate = videoSpeed; // Ajusta la velocidad para coincidir con el crecimiento
    videoElement.play(); // Reproduce el video

    // Pausar el video cuando alcanza el punto de crecimiento calculado
    setTimeout(() => {
        videoElement.pause(); // Detén el video en el momento adecuado

        progressBar.style.width = '100%';

        setTimeout(() => {
            document.getElementById('finalHeightDisplay').textContent = 
                `Altura final: ${finalHeight.toFixed(2)} metros`;
            document.getElementById('growthDisplay').textContent = 
                `Crecimiento total: ${growth.toFixed(2)} metros`;
            isAnimating = false;
            simulateButton.disabled = false;
        }, 3000);
    }, videoTargetTime * 1000); // Convertimos el tiempo a milisegundos para el setTimeout
}

function resetSimulation() {
    if (isAnimating) return;

    const h0 = parseFloat(document.getElementById('initialHeight').value);
    const H = parseFloat(document.getElementById('maxHeight').value);

    document.querySelector('.progress-bar').style.width = '0%';

    // Reinicia el video al principio
    videoElement.currentTime = 0;
    videoElement.pause();

    document.getElementById('initialHeightDisplay').textContent = 
        `Altura inicial: ${h0.toFixed(2)} metros`;
    document.getElementById('finalHeightDisplay').textContent = 
        `Altura final: 0.00 metros`;
    document.getElementById('growthDisplay').textContent = 
        `Crecimiento total: 0.00 metros`;
}

window.onload = function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    resetSimulation();
};


