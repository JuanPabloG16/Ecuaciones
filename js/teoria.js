function openTab(evt, tabName) {
    var i, content, tabs;
    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) {
        content[i].classList.remove("active");
    }
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

const ctx = document.getElementById('growthChart').getContext('2d');
let growthChart;

function calculateGrowth(initialHeight, years) {
    const H = 30; // Altura máxima
    const k = 0.5; // Constante de crecimiento
    const C = (H - initialHeight) / H;
    
    const data = [];
    for (let t = 0; t <= years; t++) {
        const height = H * (1 - C * Math.exp(-k * t / H));
        data.push({ x: t, y: parseFloat(height.toFixed(2)) });
    }
    return data;
}

function updateChart() {
    const initialHeight = parseFloat(document.getElementById('initialHeight').value);
    const years = parseInt(document.getElementById('years').value);
    
    document.getElementById('initialHeightValue').textContent = initialHeight.toFixed(1) + ' m';
    document.getElementById('yearsValue').textContent = years + ' años';

    const data = calculateGrowth(initialHeight, years);

    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Altura del Pino',
                data: data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Tiempo (años)'
                    }
                },
                y:  {
                    title: {
                        display: true,
                        text: 'Altura (metros)'
                    },
                    min: 0,
                    max: 35
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Altura: ${context.parsed.y.toFixed(2)} m`; // Uso correcto de template string
                        }
                    }
                }
            }
        }
    });
}

// Event listeners
document.getElementById('initialHeight').addEventListener('input', updateChart);
document.getElementById('years').addEventListener('input', updateChart);

// Initial chart
document.addEventListener('DOMContentLoaded', function() {
    updateChart();  // Esto inicializa el gráfico en cuanto la página se carga
});
