let scene, camera, renderer, mars, cosmos;

function initMars() {
    console.log("Inicjalizacja sceny Marsa...");
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Przezroczyste tło
    const marsContainer = document.getElementById("mars-container");
    if (marsContainer) {
        marsContainer.appendChild(renderer.domElement);
        marsContainer.style.zIndex = "-2"; // Mars poniżej Matrix
        console.log("Renderer dodany do mars-container");
    } else {
        console.error("Błąd: #mars-container nie znaleziony!");
    }

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        'textures/4k_mars.jpg',
        (texture) => {
            console.log("Textura 4k_mars.jpg załadowana pomyślnie!");
            const marsGeometry = new THREE.SphereGeometry(5, 64, 64);
            const marsMaterial = new THREE.MeshStandardMaterial({ map: texture });
            mars = new THREE.Mesh(marsGeometry, marsMaterial);
            scene.add(mars);
        },
        undefined,
        (error) => {
            console.error("Błąd ładowania textury 4k_mars.jpg:", error);
            const marsGeometry = new THREE.SphereGeometry(5, 64, 64);
            const marsMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            mars = new THREE.Mesh(marsGeometry, marsMaterial);
            scene.add(mars);
        }
    );

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const cosmosGeometry = new THREE.SphereGeometry(50, 32, 32);
    textureLoader.load(
        'textures/starfield.jpg',
        (texture) => {
            console.log("Textura starfield.jpg załadowana pomyślnie!");
            const cosmosMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide
            });
            cosmos = new THREE.Mesh(cosmosGeometry, cosmosMaterial);
            scene.add(cosmos);
        },
        undefined,
        (error) => {
            console.error("Błąd ładowania textury starfield.jpg:", error);
        }
    );

    animateMars();
}

function animateMars() {
    requestAnimationFrame(animateMars);
    if (mars) mars.rotation.y += 0.0002;
    if (cosmos) cosmos.rotation.y -= 0.0001;
    renderer.render(scene, camera);
}

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
});

initMars();