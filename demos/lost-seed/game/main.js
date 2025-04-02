import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { initUI, updateUI } from './ui.js';
import { initAudio, playSound } from './audio.js';
import { initParticles, updateParticles } from './particles.js';

// 游戏状态
const gameState = {
    seeds: [],
    trees: [
        { id: 0, name: '主希望之树', type: 'main', status: 'awake', position: new THREE.Vector3(0, 0, 0) },
        { id: 1, name: '感恩之树', type: 'gratitude', status: 'asleep', position: new THREE.Vector3(-30, 0, -40) },
        { id: 2, name: '智慧之树', type: 'wisdom', status: 'asleep', position: new THREE.Vector3(40, 0, -30) },
        { id: 3, name: '勇气之树', type: 'courage', status: 'asleep', position: new THREE.Vector3(50, 0, 30) },
        { id: 4, name: '爱之树', type: 'love', status: 'asleep', position: new THREE.Vector3(-20, 0, 50) },
        { id: 5, name: '和谐之树', type: 'harmony', status: 'asleep', position: new THREE.Vector3(-50, 0, 10) }
    ],
    doorStatus: 'locked',
    gratitudeCount: 0,
    achievements: [],
    discoveredLore: [],
    settings: {
        fogDensity: 0.03,
        seedGlow: 1.5,
        musicVolume: 0.3,
        sfxVolume: 0.5,
        language: 'zh',
        showTutorials: true
    }
};

// 3D场景相关变量
let scene, camera, renderer, controls;
let forest, trees = [], seeds3D = [], door;
let fogMaterial;
let clock = new THREE.Clock();
let mixer;
let loadingManager;

// 初始化函数
function init() {
    initLoadingScreen();
    initScene();
    initLights();
    initControls();
    loadModels();
    initUI(gameState);
    initAudio(gameState.settings);
    initParticles(scene);
    
    animate();
    
    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);
}

// 初始化加载屏幕
function initLoadingScreen() {
    loadingManager = new THREE.LoadingManager();
    
    loadingManager.onProgress = function(url, loaded, total) {
        const progress = (loaded / total) * 100;
        document.querySelector('.loading-progress').style.width = progress + '%';
    };
    
    loadingManager.onLoad = function() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                
                // 显示介绍覆盖层
                document.getElementById('intro-overlay').classList.remove('hidden');
                
                // 开始播放背景音乐
                const bgMusic = document.getElementById('background-music');
                bgMusic.volume = gameState.settings.musicVolume;
                bgMusic.play();
            }, 1000);
        }, 1000);
    };
}

// 初始化3D场景
function initScene() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a2c1a);
    
    // 添加雾效
    scene.fog = new THREE.FogExp2(0x1a2c1a, gameState.settings.fogDensity);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 30);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('forest-scene').appendChild(renderer.domElement);
    
    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2e4c2e,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
}

// 初始化灯光
function initLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // 方向光（模拟太阳光）
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
    
    // 添加一些点光源在树周围
    gameState.trees.forEach(treeData => {
        const pointLight = new THREE.PointLight(0x4caf50, 0.5, 20);
        pointLight.position.copy(treeData.position);
        pointLight.position.y = 10;
        scene.add(pointLight);
    });
}

// 初始化控制器
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 5, 0);
}

// 加载3D模型
function loadModels() {
    const loader = new GLTFLoader(loadingManager);
    
    // 加载森林环境
    loader.load('assets/models/forest_environment.glb', (gltf) => {
        forest = gltf.scene;
        forest.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(forest);
        
        // 如果有动画，设置动画混合器
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(forest);
            gltf.animations.forEach(clip => {
                mixer.clipAction(clip).play();
            });
        }
    });
    
    // 加载树木模型
    gameState.trees.forEach(treeData => {
        loader.load(`assets/models/tree_${treeData.type}.glb`, (gltf) => {
            const treeModel = gltf.scene;
            treeModel.position.copy(treeData.position);
            treeModel.scale.set(5, 5, 5);
            
            treeModel.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // 如果树处于沉睡状态，添加灰色效果
                    if (treeData.status === 'asleep') {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x607d8b,
                            roughness: 0.8,
                            metalness: 0.2
                        });
                    }
                }
            });
            
            scene.add(treeModel);
            trees.push({ model: treeModel, data: treeData });
        });
    });
    
    // 加载幸福之门
    loader.load('assets/models/happiness_door.glb', (gltf) => {
        door = gltf.scene;
        door.position.set(0, 0, -50);
        door.scale.set(5, 5, 5);
        
        door.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        scene.add(door);
    });
}

// 窗口大小变化时调整
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // 更新控制器
    controls.update();
    
    // 更新动画混合器
    if (mixer) mixer.update(delta);
    
    // 更新粒子系统
    updateParticles(delta);
    
    // 渲染场景
    renderer.render(scene, camera);
}

// 添加种子到游戏
function addSeed(seedData) {
    gameState.seeds.push(seedData);
    
    // 创建3D种子模型
    const seedGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const seedMaterial = new THREE.MeshStandardMaterial({
        color: getSeedColor(seedData.type),
        emissive: getSeedColor(seedData.type),
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const seedMesh = new THREE.Mesh(seedGeometry, seedMaterial);
    
    // 随机位置（在主树周围）
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 5;
    seedMesh.position.set(
        Math.cos(angle) * radius,
        1 + Math.random() * 2,
        Math.sin(angle) * radius
    );
    
    scene.add(seedMesh);
    seeds3D.push({ mesh: seedMesh, data: seedData });
    
    // 更新UI
    updateUI(gameState);
    
    // 播放收集种子的声音
    playSound('seed-collect-sound');
    
    // 显示成就通知
    showAchievement('希望种子', `你收集了一颗${getSeedTypeName(seedData.type)}！`);
    
    return seedData;
}

// 唤醒树木
function awakenTree(treeId) {
    const treeIndex = gameState.trees.findIndex(t => t.id === treeId);
    if (treeIndex === -1) return false;
    
    gameState.trees[treeIndex].status = 'awake';
    
    // 更新3D模型
    const treeObj = trees.find(t => t.data.id === treeId);
    if (treeObj && treeObj.model) {
        treeObj.model.traverse(child => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: getSeedColor(treeObj.data.type),
                    emissive: getSeedColor(treeObj.data.type),
                    emissiveIntensity: 0.2,
                    roughness: 0.5,
                    metalness: 0.3
                });
            }
        });
        
        // 添加光晕效果
        const pointLight = new THREE.PointLight(
            getSeedColor(treeObj.data.type),
            1,
            30
        );
        pointLight.position.copy(treeObj.data.position);
        pointLight.position.y = 10;
        scene.add(pointLight);
    }
    
    // 播放树木觉醒的声音
    playSound('tree-awaken-sound');
    
    // 显示树木觉醒动画
    document.getElementById('tree-awakening-animation').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('tree-awakening-animation').classList.add('hidden');
    }, 3000);
    
    // 更新UI
    updateUI(gameState);
    
    // 显示成就通知
    showAchievement('希望之树', `你唤醒了${gameState.trees[treeIndex].name}！`);
    
    // 检查是否所有树木都被唤醒
    checkAllTreesAwakened();
    
    return true;
}

// 检查是否所有树木都被唤醒
function checkAllTreesAwakened() {
    const allAwake = gameState.trees.every(tree => tree.status === 'awake');
    
    if (allAwake && gameState.doorStatus === 'locked') {
        // 解锁幸福之门
        unlockHappinessDoor();
    }
}

// 解锁幸福之门
function unlockHappinessDoor() {
    gameState.doorStatus = 'unlocked';
    
    // 更新门的3D模型
    if (door) {
        door.traverse(child => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xffd700,
                    emissive: 0xffd700,
                    emissiveIntensity: 0.5,
                    roughness: 0.3,
                    metalness: 0.7
                });
            }
        });
        
        // 添加光晕效果
        const doorLight = new THREE.PointLight(0xffd700, 2, 50);
        doorLight.position.copy(door.position);
        doorLight.position.y = 10;
        scene.add(doorLight);
    }
    
    // 播放门解锁的声音
    playSound('door-unlock-sound');
    
    // 更新UI
    updateUI(gameState);
    
    // 显示成就通知
    showAchievement('幸福之门', '你已经唤醒了所有希望之树，幸福之门已开启！');
}

// 显示成就通知
function showAchievement(title, description) {
    const achievementNotification = document.getElementById('achievement-notification');
    const achievementTitle = document.getElementById('achievement-title');
    const achievementDescription = document.getElementById('achievement-description');
    
    achievementTitle.textContent = title;
    achievementDescription.textContent = description;
    
    achievementNotification.classList.remove('hidden');
    
    // 播放成就音效
    playSound('achievement-sound');
    
    // 3秒后隐藏通知
    setTimeout(() => {
        achievementNotification.classList.add('hidden');
    }, 3000);
}

// 获取种子颜色
function getSeedColor(type) {
    switch (type) {
        case 'gratitude': return 0x4caf50; // 绿色
        case 'wisdom': return 0x2196f3; // 蓝色
        case 'courage': return 0xff9800; // 橙色
        case 'love': return 0xe91e63; // 粉色
        case 'harmony': return 0x9c27b0; // 紫色
        default: return 0x4caf50; // 默认绿色
    }
}

// 获取种子类型名称
function getSeedTypeName(type) {
    switch (type) {
        case 'gratitude': return '感恩种子';
        case 'wisdom': return '智慧种子';
        case 'courage': return '勇气种子';
        case 'love': return '爱之种子';
        case 'harmony': return '和谐种子';
        default: return '希望种子';
    }
}

// 导出函数和变量
export {
    init,
    gameState,
    addSeed,
    awakenTree,
    unlockHappinessDoor,
    showAchievement,
    getSeedColor,
    getSeedTypeName
};

// 当页面加载完成时初始化游戏
window.addEventListener('DOMContentLoaded', init);

