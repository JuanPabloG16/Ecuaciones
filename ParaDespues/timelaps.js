let isAnimating = false;

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

function updateTree(height, maxHeight) {
    const trunk = document.querySelector('.trunk');
    const treeHeight = (height / maxHeight) * 450;
    trunk.style.height = `${treeHeight}px`;
    updateFoliage(height, maxHeight);
}

function updateFoliage(height, maxHeight) {
    const crown = document.querySelector('.crown');
    if (!crown) {
        const newCrown = document.createElement('div');
        newCrown.className = 'crown';
        document.querySelector('.tree').appendChild(newCrown);
    }

    const growthRatio = height / maxHeight;
    crown.style.opacity = growthRatio; // Follaje más denso a medida que crece
    crown.style.transform = `scale(${growthRatio * 1.1})`; // Incrementa el tamaño del follaje proporcionalmente al crecimiento
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

    setTimeout(() => {
        updateTree(finalHeight, H);
        progressBar.style.width = '100%';

        setTimeout(() => {
            document.getElementById('finalHeightDisplay').textContent = 
                `Altura final: ${finalHeight.toFixed(2)} metros`;
            document.getElementById('growthDisplay').textContent = 
                `Crecimiento total: ${growth.toFixed(2)} metros`;
            isAnimating = false;
            simulateButton.disabled = false;
        }, 3000);
    }, 100);
}

function resetSimulation() {
    if (isAnimating) return;

    const tree = document.querySelector('.tree');
    tree.innerHTML = '<div class="trunk"></div>';

    const h0 = parseFloat(document.getElementById('initialHeight').value);
    const H = parseFloat(document.getElementById('maxHeight').value);

    document.querySelector('.progress-bar').style.width = '0%';
    updateTree(h0, H);

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

