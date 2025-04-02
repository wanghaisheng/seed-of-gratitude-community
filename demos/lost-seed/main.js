import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Game state
const gameState = {
    seeds: [],
    activeTree: null,
    trees: [],
    doorUnlocked: false,
    seedsRequired: 5,
    /* @tweakable fog density - controls how thick the forest mist is */
    fogDensity: 0.03,
    /* @tweakable background music volume */
    musicVolume: 0.3,
    /* @tweakable seed glow intensity - controls how bright the seeds glow */
    seedGlowIntensity: 1.5,
    /* @tweakable particle count - number of particles in effects */
    particleCount: 30,
    /* @tweakable particle lifetime in seconds */
    particleLifetime: 2,
    /* @tweakable inventory slots per row - controls how many seeds appear in each row */
    inventorySlotsPerRow: 4,
    /* @tweakable seed color variations - colors for different seed types */
    seedColors: {
        default: '#4caf50',
        gratitude: '#4caf50',
        wisdom: '#2196f3',
        courage: '#ff9800',
        love: '#e91e63',
        harmony: '#9c27b0'
    },
    /* @tweakable seed animation speed - controls how fast seeds pulse in inventory */
    seedAnimationSpeed: 1.5,
    /* @tweakable panel transition duration in milliseconds */
    panelTransitionDuration: 300,
    activePanel: null,
    /* @tweakable sfx volume */
    sfxVolume: 0.5
};

// Forest scene setup
let scene, camera, renderer, controls;
let terrain, trees = [], door;

// Initialize the 3D scene
function initScene() {
    // Create scene
    scene = new THREE.Scene();
    /* @tweakable forest fog color */
    scene.fog = new THREE.FogExp2('#1a2c1a', gameState.fogDensity);
    scene.background = new THREE.Color('#0a100a');

    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 3, 15);

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('forest-scene').appendChild(renderer.domElement);

    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#496b49', 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#a5d6a7', 0.8);
    directionalLight.position.set(5, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Create terrain
    createTerrain();
    
    // Create hope trees
    createHopeTrees();
    
    // Create the Bliss Door
    createBlissDoor();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createTerrain() {
    const geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: '#2e3b2e',
        side: THREE.DoubleSide,
        roughness: 0.8,
    });
    
    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
}

function createHopeTree(x, z, size = 1, type = 'normal') {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);
    
    // Create tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2 * size, 0.3 * size, 2 * size, 8);
    /* @tweakable trunk color - the color of the tree trunks */
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#513714', roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1 * size;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    // Create tree foliage
    let foliageGeometry;
    let foliageColor;
    
    switch(type) {
        case 'locked':
            foliageGeometry = new THREE.SphereGeometry(1 * size, 8, 6);
            /* @tweakable locked tree color - the color of undiscovered trees */
            foliageColor = '#374537';
            break;
        case 'unlocked':
            foliageGeometry = new THREE.ConeGeometry(1.2 * size, 2.5 * size, 8);
            /* @tweakable unlocked tree color - the color of awakened trees */
            foliageColor = '#4CAF50';
            break;
        default:
            foliageGeometry = new THREE.SphereGeometry(1 * size, 8, 6);
            foliageColor = '#374537';
    }
    
    const foliageMaterial = new THREE.MeshStandardMaterial({ 
        color: foliageColor,
        roughness: 0.8,
    });
    
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3 * size;
    foliage.castShadow = true;
    treeGroup.add(foliage);
    
    // Add tree to scene
    scene.add(treeGroup);
    
    return {
        mesh: treeGroup,
        type: type,
        unlocked: type === 'unlocked',
        position: { x, z }
    };
}

function createHopeTrees() {
    // Create main hope tree in the center
    const mainTree = createHopeTree(0, 0, 1.5, 'unlocked');
    mainTree.unlocked = true;
    mainTree.isMainTree = true;
    gameState.activeTree = mainTree;
    trees.push(mainTree);
    
    // Create locked hope trees around in a circle
    const radius = 12;
    const treeCount = 5;
    for (let i = 0; i < treeCount; i++) {
        const angle = (i / treeCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        /* @tweakable tree scaling factor - changes the size of trees */
        const treeScale = 1.2 + (Math.random() * 0.4 - 0.2);
        const tree = createHopeTree(x, z, treeScale, 'locked');
        trees.push(tree);
        gameState.trees.push({
            id: i + 1,
            unlocked: false,
            seedsRequired: (i + 1) * gameState.seedsRequired,
            position: { x, z }
        });
    }
}

function createBlissDoor() {
    const doorGroup = new THREE.Group();
    
    // Door frame
    const frameGeometry = new THREE.BoxGeometry(4, 6, 0.5);
    /* @tweakable door frame color */
    const frameMaterial = new THREE.MeshStandardMaterial({ color: '#5D4037', roughness: 0.7 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 3;
    doorGroup.add(frame);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(3, 5, 0.3);
    /* @tweakable door color */
    const doorMaterial = new THREE.MeshStandardMaterial({ 
        color: '#795548', 
        roughness: 0.5,
        opacity: 0.9,
        transparent: true
    });
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    doorMesh.position.z = 0.2;
    doorMesh.position.y = 2.5;
    doorGroup.add(doorMesh);
    
    // Door position in the forest
    doorGroup.position.set(0, 0, -15);
    doorGroup.rotation.y = Math.PI;
    
    // Add door to scene
    scene.add(doorGroup);
    door = doorGroup;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate trees swaying
    trees.forEach(tree => {
        if (tree.unlocked) {
            const time = Date.now() * 0.001;
            /* @tweakable tree sway amount - controls how much trees move in the wind */
            const swayAmount = 0.02;
            const sway = Math.sin(time + tree.position.x) * swayAmount;
            tree.mesh.rotation.x = sway * 0.3;
            tree.mesh.rotation.z = sway * 0.5;
        }
    });
    
    // Update particles if they exist
    if (window.particles) {
        updateParticles();
    }
    
    // Animate mist/fog
    scene.fog.density = gameState.fogDensity + Math.sin(Date.now() * 0.0005) * 0.005;
    
    // Render the scene
    renderer.render(scene, camera);
}

// Particle system
function createParticleSystem(position, color, type = 'unlock') {
    const particles = [];
    const particleCount = gameState.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Set initial position
        particle.position.set(
            position.x + (Math.random() * 2 - 1) * 0.2,
            position.y + (Math.random() * 2) * 0.5,
            position.z + (Math.random() * 2 - 1) * 0.2
        );
        
        // Set initial velocity
        const speed = type === 'unlock' ? 1 : 0.5;
        particle.velocity = new THREE.Vector3(
            (Math.random() * 2 - 1) * speed,
            (Math.random() * 1 + 1) * speed,
            (Math.random() * 2 - 1) * speed
        );
        
        particle.lifetime = gameState.particleLifetime;
        particle.born = Date.now() / 1000;
        
        scene.add(particle);
        particles.push(particle);
    }
    
    window.particles = window.particles || [];
    window.particles.push(...particles);
    
    return particles;
}

function updateParticles() {
    const currentTime = Date.now() / 1000;
    const particles = window.particles;
    
    if (!particles || particles.length === 0) return;
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const age = currentTime - particle.born;
        
        if (age > particle.lifetime) {
            scene.remove(particle);
            particles.splice(i, 1);
            continue;
        }
        
        const lifePercent = age / particle.lifetime;
        
        // Update position
        particle.position.x += particle.velocity.x * 0.01;
        particle.position.y += particle.velocity.y * 0.01;
        particle.position.z += particle.velocity.z * 0.01;
        
        // Update scale and opacity
        const scale = 1 - lifePercent;
        particle.scale.set(scale, scale, scale);
        particle.material.opacity = 1 - lifePercent;
    }
}

function createUnlockEffect(position) {
    /* @tweakable unlock effect color - the color of particles when a tree is unlocked */
    const unlockColor = '#a5d6a7';
    createParticleSystem({
        x: position.x,
        y: 3,
        z: position.z
    }, unlockColor, 'unlock');
    
    // Add light flash
    const flashLight = new THREE.PointLight(unlockColor, 3, 10);
    flashLight.position.set(position.x, 3, position.z);
    scene.add(flashLight);
    
    // Remove light after animation
    setTimeout(() => {
        scene.remove(flashLight);
    }, 2000);
}

function createSeedEffect() {
    /* @tweakable seed effect color - the color of particles when a seed is created */
    const seedColor = '#FFC107';
    createParticleSystem({
        x: 0,
        y: 2,
        z: 0
    }, seedColor, 'seed');
}

// UI Interaction
function initUI() {
    // Journal entry save button
    document.getElementById('save-entry').addEventListener('click', saveGratitudeEntry);
    
    // Message box close button
    document.getElementById('message-close').addEventListener('click', closeMessage);
    
    // Menu buttons event listeners
    document.getElementById('inventory-button').addEventListener('click', () => togglePanel('inventory-panel'));
    document.getElementById('map-button').addEventListener('click', () => togglePanel('map-panel'));
    document.getElementById('settings-button').addEventListener('click', () => togglePanel('settings-panel'));
    
    // Close panel buttons
    document.querySelectorAll('.close-panel').forEach(button => {
        button.addEventListener('click', closeActivePanel);
    });
    
    // Inventory tabs
    document.querySelectorAll('.inventory-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.inventory-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const tabName = e.target.dataset.tab;
            document.querySelectorAll('.inventory-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-inventory`).classList.add('active');
        });
    });
    
    // Settings sliders
    document.getElementById('fog-density').addEventListener('input', (e) => {
        gameState.fogDensity = parseFloat(e.target.value);
        scene.fog.density = gameState.fogDensity;
    });
    
    document.getElementById('seed-glow').addEventListener('input', (e) => {
        gameState.seedGlowIntensity = parseFloat(e.target.value);
        updateSeedVisuals();
    });
    
    document.getElementById('music-volume').addEventListener('input', (e) => {
        gameState.musicVolume = parseFloat(e.target.value);
        // Update music volume if music is playing
    });
    
    document.getElementById('sfx-volume').addEventListener('input', (e) => {
        gameState.sfxVolume = parseFloat(e.target.value);
    });
    
    // Map markers
    document.querySelectorAll('.map-marker.locked-tree').forEach(marker => {
        marker.addEventListener('click', (e) => {
            const treeId = parseInt(e.target.dataset.treeId);
            const tree = gameState.trees.find(t => t.id === treeId);
            if (tree) {
                showTreeInfo(tree);
            }
        });
    });
    
    // Update UI with initial game state
    updateUI();
}

function togglePanel(panelId) {
    // Play UI sound
    playUISound('click');
    
    // If this panel is already active, close it
    if (gameState.activePanel === panelId) {
        closeActivePanel();
        return;
    }
    
    // Close any currently open panel
    closeActivePanel();
    
    // Open the new panel
    const panel = document.getElementById(panelId);
    panel.classList.remove('hidden');
    
    // Special handling for specific panels
    if (panelId === 'inventory-panel') {
        populateInventory();
    } else if (panelId === 'map-panel') {
        updateMapMarkers();
    }
    
    gameState.activePanel = panelId;
}

function closeActivePanel() {
    if (gameState.activePanel) {
        document.getElementById(gameState.activePanel).classList.add('hidden');
        gameState.activePanel = null;
    }
}

function populateInventory() {
    const seedGrid = document.querySelector('.seed-grid');
    seedGrid.innerHTML = '';
    
    if (gameState.seeds.length === 0) {
        seedGrid.innerHTML = '<p class="empty-message">还未收集到任何希望种子。</p>';
        return;
    }
    
    gameState.seeds.forEach(seed => {
        const seedItem = document.createElement('div');
        seedItem.className = 'seed-item';
        seedItem.dataset.id = seed.id;
        
        const seedVisual = document.createElement('div');
        seedVisual.className = `seed-visual ${seed.used ? 'used' : ''}`;
        seedVisual.innerHTML = `<span>${seed.id}</span>`;
        
        const seedDate = document.createElement('div');
        seedDate.className = 'seed-date';
        seedDate.textContent = formatDate(seed.date);
        
        seedItem.appendChild(seedVisual);
        seedItem.appendChild(seedDate);
        
        seedItem.addEventListener('click', () => showSeedDetails(seed));
        
        seedGrid.appendChild(seedItem);
    });
}

function showSeedDetails(seed) {
    // Play UI sound
    playUISound('select');
    
    // Fill the seed detail panel
    document.getElementById('seed-date').textContent = formatDate(seed.date);
    document.getElementById('seed-entry').textContent = seed.entry;
    
    // Create seed visualization
    const seedVisual = document.getElementById('seed-visual');
    seedVisual.innerHTML = '';
    
    const visualization = document.createElement('div');
    visualization.className = `seed-detail-visualization ${seed.used ? 'used' : ''}`;
    visualization.innerHTML = `<span>${seed.id}</span>`;
    seedVisual.appendChild(visualization);
    
    // Update buttons availability
    const plantBtn = document.getElementById('plant-seed');
    const offerBtn = document.getElementById('offer-seed');
    
    if (seed.used) {
        plantBtn.disabled = true;
        offerBtn.disabled = true;
        plantBtn.style.opacity = '0.5';
        offerBtn.style.opacity = '0.5';
    } else {
        plantBtn.disabled = false;
        offerBtn.disabled = false;
        plantBtn.style.opacity = '1';
        offerBtn.style.opacity = '1';
        
        // Add event listeners for seed actions
        plantBtn.onclick = () => plantSeed(seed);
        offerBtn.onclick = () => offerSeed(seed);
    }
    
    // Show the panel
    closeActivePanel();
    document.getElementById('seed-detail-panel').classList.remove('hidden');
    gameState.activePanel = 'seed-detail-panel';
}

function plantSeed(seed) {
    // Logic for planting a seed
    showMessage("种子已经种下，希望之树正在吸收它的能量...");
    
    // Mark seed as used
    seed.used = true;
    
    // Play plant sound
    playUISound('plant');
    
    // Create plant effect at active tree
    if (gameState.activeTree) {
        createUnlockEffect(gameState.activeTree.mesh.position);
    }
    
    // Close panel and update UI
    closeActivePanel();
    updateUI();
    checkUnlocks();
}

function offerSeed(seed) {
    // Logic for offering a seed to unlock a tree
    showMessage("种子已奉献给希望之神，正在唤醒沉睡的希望之树...");
    
    // Mark seed as used
    seed.used = true;
    
    // Play offer sound
    playUISound('offer');
    
    // Close panel and update UI
    closeActivePanel();
    updateUI();
    checkUnlocks();
}

function updateMapMarkers() {
    // Update tree markers on map based on game state
    gameState.trees.forEach((tree, index) => {
        const marker = document.querySelector(`.map-marker[data-tree-id="${tree.id}"]`);
        if (marker) {
            if (tree.unlocked) {
                marker.classList.remove('locked-tree');
                marker.classList.add('unlocked-tree');
            }
        }
    });
    
    // Update door marker if unlocked
    if (gameState.doorUnlocked) {
        const doorMarker = document.querySelector('.map-marker.gate');
        if (doorMarker) {
            doorMarker.style.fill = '#ffcc80';
            doorMarker.style.filter = 'drop-shadow(0 0 3px #ff9800)';
        }
    }
}

function showTreeInfo(tree) {
    let message = '';
    
    if (tree.unlocked) {
        message = `这棵希望之树已被唤醒，生机勃勃。`;
    } else {
        message = `这棵沉睡的希望之树需要${tree.seedsRequired}颗希望种子来唤醒。目前你已收集了${gameState.seeds.length}颗种子，其中${gameState.seeds.filter(s => !s.used).length}颗尚未使用。`;
    }
    
    showMessage(message);
}

function formatDate(date) {
    // Format date as MM-DD
    const d = new Date(date);
    return `${d.getMonth() + 1}-${d.getDate()}`;
}

function playUISound(type) {
    // Play sound effects for UI interactions
    let sound;
    
    switch(type) {
        case 'click':
            // Button click sound
            break;
        case 'select':
            // Selection sound
            break;
        case 'plant':
            // Planting seed sound
            break;
        case 'offer':
            // Offering seed sound
            break;
    }
    
    // When sound system is implemented:
    // if (sound) {
    //     sound.volume = gameState.sfxVolume;
    //     sound.play();
    // }
}

function updateSeedVisuals() {
    // Update seed glow intensity based on settings
    document.querySelectorAll('.seed-visual').forEach(seed => {
        seed.style.boxShadow = `0 0 ${10 * gameState.seedGlowIntensity}px rgba(76, 175, 80, ${0.7 * gameState.seedGlowIntensity})`;
    });
}

function saveGratitudeEntry() {
    const entry = document.getElementById('gratitude-entry').value.trim();
    
    if (entry.length < 10) {
        showMessage("请至少写下10个字符的感恩内容。");
        return;
    }
    
    // Create a new seed
    const newSeed = {
        id: gameState.seeds.length + 1,
        entry: entry,
        date: new Date(),
        used: false
    };
    
    gameState.seeds.push(newSeed);
    document.getElementById('gratitude-entry').value = '';
    
    // Create visual seed effect
    createSeedEffect();
    
    // Show success message
    showMessage("感谢你的感恩！一颗新的希望种子已经诞生。");
    
    // Add seed to UI
    addSeedToUI(newSeed);
    
    // Check if can unlock anything
    checkUnlocks();
    
    // Update UI
    updateUI();
    
    // Also populate inventory after creating a new seed
    if (gameState.activePanel === 'inventory-panel') {
        populateInventory();
    }
}

function addSeedToUI(seed) {
    const seedsList = document.getElementById('seeds-list');
    const seedElement = document.createElement('div');
    seedElement.className = 'seed';
    seedElement.dataset.id = seed.id;
    seedElement.innerHTML = `<span>${seed.id}</span>`;
    seedElement.title = seed.entry.substring(0, 30) + (seed.entry.length > 30 ? '...' : '');
    
    seedElement.addEventListener('click', () => {
        showMessage(`"${seed.entry}"`);
    });
    
    seedsList.appendChild(seedElement);
}

function checkUnlocks() {
    const availableSeeds = gameState.seeds.filter(seed => !seed.used).length;
    
    // Check if we can unlock any trees
    gameState.trees.forEach(tree => {
        if (!tree.unlocked && availableSeeds >= tree.seedsRequired) {
            showMessage(`你已收集足够的种子！希望之树已被唤醒！`);
            tree.unlocked = true;
            
            // Mark seeds as used
            const seedsToUse = gameState.seedsRequired;
            let usedCount = 0;
            
            gameState.seeds.forEach(seed => {
                if (!seed.used && usedCount < seedsToUse) {
                    seed.used = true;
                    usedCount++;
                }
            });
            
            // Update 3D tree
            const treeIndex = tree.id;
            if (trees[treeIndex]) {
                trees[treeIndex].unlocked = true;
                trees[treeIndex].type = 'unlocked';
                
                // Update tree appearance
                const foliage = trees[treeIndex].mesh.children[1];
                foliage.material.color.set('#4CAF50');
                
                // Optional: Add particle effect for unlocking
                createUnlockEffect(trees[treeIndex].mesh.position);
            }
        }
    });
    
    // Check if door can be unlocked
    const allTreesUnlocked = gameState.trees.every(tree => tree.unlocked);
    if (allTreesUnlocked && !gameState.doorUnlocked) {
        gameState.doorUnlocked = true;
        showMessage("所有希望之树都已被唤醒！幸福之门正在开启...");
        
        // Animate door opening
        animateDoorOpening();
    }
    
    // Update map markers if map is open
    if (gameState.activePanel === 'map-panel') {
        updateMapMarkers();
    }
}

function animateDoorOpening() {
    // For now we'll just change the door color
    door.children[1].material.color.set('#a5d6a7');
    door.children[1].material.opacity = 0.7;
    
    // Add door opening effect
    /* @tweakable door effect color - the color of particles when the door opens */
    const doorColor = '#FFD54F';
    createParticleSystem({
        x: door.position.x,
        y: door.position.y + 3,
        z: door.position.z
    }, doorColor, 'door');
    
    // Move camera to face the door
    const targetPosition = new THREE.Vector3(0, 3, -10);
    
    // Animate camera movement
    const startPosition = camera.position.clone();
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        camera.position.lerpVectors(startPosition, targetPosition, progress);
        camera.lookAt(door.position);
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    }
    
    animateCamera();
}

function updateUI() {
    // Update seed count
    const availableSeeds = gameState.seeds.filter(seed => !seed.used).length;
    const totalSeeds = gameState.seeds.length;
    
    // Update tree status
    const treeStatus = document.getElementById('tree-status');
    const unlockedTrees = gameState.trees.filter(tree => tree.unlocked).length;
    treeStatus.textContent = `已唤醒: ${unlockedTrees} / ${gameState.trees.length}`;
    
    // Update door status
    const doorStatus = document.getElementById('door-status');
    if (gameState.doorUnlocked) {
        doorStatus.textContent = "已开启";
        doorStatus.style.color = "#a5d6a7";
    } else {
        const allTreesUnlocked = gameState.trees.every(tree => tree.unlocked);
        if (allTreesUnlocked) {
            doorStatus.textContent = "准备开启";
            doorStatus.style.color = "#FFC107";
        } else {
            doorStatus.textContent = `需要唤醒所有希望之树`;
        }
    }
}

function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

function closeMessage() {
    const messageBox = document.getElementById('message-box');
    messageBox.classList.add('hidden');
}

// Initialize game
window.onload = function() {
    initScene();
    initUI();
    
    // Introduction message
    setTimeout(() => {
        showMessage("欢迎来到遗忘森林，艾瑞恩。在这里，每一次感恩都能创造希望的种子，唤醒沉睡的希望之树。记录你的感恩，解开森林的秘密吧！");
    }, 1000);
};

