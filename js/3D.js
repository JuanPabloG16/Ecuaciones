const TreeGrowthModel = (function() {
    let scene, camera, renderer, controls;
    let treeTrunk, treeLeaves = [], ground, river, mountains, bushes;
    let H = 15, h0 = 2, k = 0.5, t = 0;
    let C = 1; // Constante para la ecuación, ahora calculada dinámicamente
    let isAnimating = false; // Controla la animación
    let isPaused = false; // Controla la pausa de la animación

    function handleResize() {
        const container = document.getElementById('canvas-container');
        const controls = document.getElementById('controls');
        
        // Obtener el ancho disponible considerando los controles
        let width = window.innerWidth;
        if (window.innerWidth > 768) {
            width -= controls.offsetWidth;
        }
        
        // Actualizar tamaño del renderer
        renderer.setSize(width, window.innerHeight);
        
        // Actualizar proporción de la cámara
        camera.aspect = width / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    function init() {
        // Configuración de la escena
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Fondo azul cielo

        // Configuración de la cámara
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth - 300, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Agregar el evento de resize
        window.addEventListener('resize', handleResize);
        
        // Llamar a handleResize inicialmente
        handleResize();

        // Iluminación
        setupLighting();

        // Añadir niebla para profundidad
        scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);

        // Crear el entorno
        createGround();
        createRiver();
        createMountains();
        createBushes();
        createTree();

        // Posición de la cámara y controles
        camera.position.set(15, 10, 15);
        setupOrbitControls();

        // Configurar controles de la UI
        setupControls();
    }

    function setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);
    }

    function createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
    }

    function createRiver() {
        const riverGeometry = new THREE.PlaneGeometry(50, 20);
        const riverMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.5 });
        river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, 0.1, -20);
        river.receiveShadow = true;
        scene.add(river);
    }

    function createMountains() {
        const mountainGeometry = new THREE.CylinderGeometry(0, 5, 10, 4);
        const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0xA9A9A9 });
        mountains = new THREE.Group();

        for (let i = 0; i < 5; i++) {
            const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
            mountain.position.set(Math.random() * 40 - 20, 5, Math.random() * 40 - 20);
            mountains.add(mountain);
        }

        scene.add(mountains);
    }

    function createBushes() {
        const bushGeometry = new THREE.SphereGeometry(1, 32, 32);
        const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x32CD32 });
        bushes = new THREE.Group();

        for (let i = 0; i < 10; i++) {
            const bush = new THREE.Mesh(bushGeometry, bushMaterial);
            bush.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
            bushes.add(bush);
        }

        scene.add(bushes);
    }

    function createTree() {
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, h0, 32);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        treeTrunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        treeTrunk.position.y = trunkGeometry.parameters.height / 2;
        treeTrunk.castShadow = true;
        scene.add(treeTrunk);

        // Crear hojas
        const leavesGeometry = new THREE.SphereGeometry(2, 32, 32);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = h0 + 2;
        treeLeaves.push(leaves);
        scene.add(leaves);
    }

    function setupOrbitControls() {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;
    }

    function setupControls() {
        document.getElementById('initialHeight').addEventListener('input', function() {
            h0 = parseFloat(this.value);
            document.getElementById('initial-height-value').textContent = h0.toFixed(2);
            calculateConstantC();
            recreateTree();
        });

        document.getElementById('H').addEventListener('input', function() {
            H = parseFloat(this.value);
            document.getElementById('H-value').textContent = H.toFixed(2);
            calculateConstantC();
        });

        document.getElementById('k').addEventListener('input', function() {
            k = parseFloat(this.value);
            document.getElementById('k-value').textContent = k.toFixed(2);
            calculateConstantC();
        });

        document.getElementById('reset-button').addEventListener('click', function() {
            location.reload(); // Reinicia toda la página
        });

        document.getElementById('start-button').addEventListener('click', function() {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        });

        document.getElementById('pause-button').addEventListener('click', function() {
            isPaused = !isPaused;
        });
    }

    function calculateConstantC() {
        C = (H - h0) / H;
    }

    function recreateTree() {
        // Eliminar el árbol actual y crear uno nuevo
        if (treeTrunk) scene.remove(treeTrunk);
        if (treeLeaves.length > 0) {
            treeLeaves.forEach(leaf => scene.remove(leaf));
            treeLeaves = [];
        }
        createTree();
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Si está en pausa, no actualizamos la altura
        if (isPaused) return;

        // Calculando la nueva altura del árbol
        const h = H * (1 - C * Math.exp(-k * t / H));
        t += 0.1;
        const yearsPassed = Math.floor(t);

        // Actualizando la altura del tronco
        if (treeTrunk) {
            const newTrunkHeight = Math.max(0, h - 2);
            treeTrunk.geometry.dispose();
            treeTrunk.geometry = new THREE.CylinderGeometry(0.5, 0.5, newTrunkHeight, 32);
            treeTrunk.position.y = newTrunkHeight / 2;
        }

        // Actualizando las hojas
        if (treeLeaves.length > 0) {
            const leaves = treeLeaves[0];
            leaves.position.y = h;
        }

        document.getElementById("tree-height").textContent = h.toFixed(2);
        document.getElementById("years-passed").textContent = yearsPassed;

        renderer.render(scene, camera);
    }

    return {
        init: init
    };
})();

document.addEventListener("DOMContentLoaded", function() {
    TreeGrowthModel.init();
});



