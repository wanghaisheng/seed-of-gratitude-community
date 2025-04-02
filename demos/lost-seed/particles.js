import * as THREE from 'three';

// 粒子系统
let particleSystem;
let particles = [];
const MAX_PARTICLES = 500;

// 初始化粒子系统
function initParticles(scene) {
    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const sizes = new Float32Array(MAX_PARTICLES);
    
    // 初始化所有粒子为不可见
    for (let i = 0; i < MAX_PARTICLES; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
        
        sizes[i] = 0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // 创建粒子材质
    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // 创建粒子系统
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // 初始化粒子数组
    particles = [];
}

// 添加粒子
function addParticle(position, color, size, lifespan, velocity) {
    // 查找一个未使用的粒子槽
    let index = -1;
    for (let i = 0; i < MAX_PARTICLES; i++) {
        if (!particles[i] || !particles[i].active) {
            index = i;
            break;
        }
    }
    
    // 如果没有可用槽，返回
    if (index === -1) return;
    
    // 创建新粒子
    particles[index] = {
        active: true,
        position: position.clone(),
        color: color.clone(),
        size: size,
        lifespan: lifespan,
        age: 0,
        velocity: velocity.clone()
    };
    
    // 更新几何体
    updateParticleGeometry(index);
}

// 更新粒子几何体
function updateParticleGeometry(index) {
    const particle = particles[index];
    
    if (!particle || !particle.active) {
        // 如果粒子不活跃，设置为不可见
        particleSystem.geometry.attributes.position.array[index * 3] = 0;
        particleSystem.geometry.attributes.position.array[index * 3 + 1] = 0;
        particleSystem.geometry.attributes.position.array[index * 3 + 2] = 0;
        particleSystem.geometry.attributes.size.array[index] = 0;
    } else {
        // 更新位置
        particleSystem.geometry.attributes.position.array[index * 3] = particle.position.x;
        particleSystem.geometry.attributes.position.array[index * 3 + 1] = particle.position.y;
        particleSystem.geometry.attributes.position.array[index * 3 + 2] = particle.position.z;
        
        // 更新颜色
        particleSystem.geometry.attributes.color.array[index * 3] = particle.color.r;
        particleSystem.geometry.attributes.color.array[index * 3 + 1] = particle.color.g;
        particleSystem.geometry.attributes.color.array[index * 3 + 2] = particle.color.b;
        
        // 更新大小
        particleSystem.geometry.attributes.size.array[index] = particle.size;
    }
    
    // 标记需要更新
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
    particleSystem.geometry.attributes.size.needsUpdate = true;
}

// 更新粒子系统
function updateParticles(deltaTime) {
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        if (particle && particle.active) {
            // 更新年龄
            particle.age += deltaTime;
            
            // 检查是否超过寿命
            if (particle.age >= particle.lifespan) {
                particle.active = false;
                updateParticleGeometry(i);
                continue;
            }
            
            // 计算生命周期比例
            const lifeRatio = particle.age / particle.lifespan;
            
            // 更新位置
            particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
            
            // 更新大小（随时间衰减）
            particle.size *= (1 - 0.2 * deltaTime);
            
            // 更新颜色（随时间变淡）
            particle.color.multiplyScalar(1 - 0.1 * deltaTime);
            
            // 更新几何体
            updateParticleGeometry(i);
        }
    }
}

// 创建树木粒子效果
function createTreeParticles(position, treeType) {
    const color = getColorForTreeType(treeType);
    
    for (let i = 0; i < 100; i++) {
        // 随机位置（在树周围）
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            Math.random() * 15,
            (Math.random() - 0.5) * 10
        );
        
        const particlePos = position.clone().add(offset);
        
        // 随机速度（向上漂浮）
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 0.5
        );
        
        // 随机大小
        const size = Math.random() * 0.5 + 0.2;
        
        // 随机寿命
        const lifespan = Math.random() * 2 + 1;
        
        // 添加粒子
        addParticle(particlePos, color, size, lifespan, velocity);
    }
}

// 创建种子粒子效果
function createSeedParticles(position, seedType) {
    const color = getColorForSeedType(seedType);
    
    for (let i = 0; i < 50; i++) {
        // 随机位置（在种子周围）
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        const particlePos = position.clone().add(offset);
        
        // 随机速度（向外扩散）
        const velocity = offset.clone().normalize().multiplyScalar(Math.random() * 0.5 + 0.5);
        
        // 随机大小
        const size = Math.random() * 0.3 + 0.1;
        
        // 随机寿命
        const lifespan = Math.random() * 1 + 0.5;
        
        // 添加粒子
        addParticle(particlePos, color, size, lifespan, velocity);
    }
}

// 根据树木类型获取颜色
function getColorForTreeType(type) {
    switch (type) {
        case 'main': return new THREE.Color(0x4caf50); // 主树 - 绿色
        case 'gratitude': return new THREE.Color(0x4caf50); // 感恩树 - 绿色
        case 'wisdom': return new THREE.Color(0x2196f3); // 智慧树 - 蓝色
        case 'courage': return new THREE.Color(0xff9800); // 勇气树 - 橙色
        case 'love': return new THREE.Color(0xe91e63); // 爱之树 - 粉色
        case 'harmony': return new THREE.Color(0x9c27b0); // 和谐树 - 紫色
        default: return new THREE.Color(0x4caf50); // 默认绿色
    }
}

// 根据种子类型获取颜色
function getColorForSeedType(type) {
    switch (type) {
        case 'gratitude': return new THREE.Color(0x4caf50); // 感恩种子 - 绿色
        case 'wisdom': return new THREE.Color(0x2196f3); // 智慧种子 - 蓝色
        case 'courage': return new THREE.Color(0xff9800); // 勇气种子 - 橙色
        case 'love': return new THREE.Color(0xe91e63); // 爱之种子 - 粉色
        case 'harmony': return new THREE.Color(0x9c27b0); // 和谐种子 - 紫色
        default: return new THREE.Color(0x4caf50); // 默认绿色
    }
}

// 创建门粒子效果
function createDoorParticles(position) {
    const color = new THREE.Color(0xffd700); // 金色
    
    for (let i = 0; i < 200; i++) {
        // 随机位置（在门周围）
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 10 + 5;
        const height = Math.random() * 15;
        
        const offset = new THREE.Vector3(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        const particlePos = position.clone().add(offset);
        
        // 随机速度（向门中心漂浮）
        const direction = new THREE.Vector3(0, 10, 0).sub(offset).normalize();
        const velocity = direction.multiplyScalar(Math.random() * 0.5 + 0.2);
        
        // 随机大小
        const size = Math.random() * 0.4 + 0.1;
        
        // 随机寿命
        const lifespan = Math.random() * 3 + 2;
        
        // 添加粒子
        addParticle(particlePos, color, size, lifespan, velocity);
    }
}

// 创建迷雾粒子效果
function createFogParticles(position, radius, count) {
    const color = new THREE.Color(0xcccccc); // 灰白色
    
    for (let i = 0; i < count; i++) {
        // 随机位置（在指定半径内）
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        const height = Math.random() * 5;
        
        const offset = new THREE.Vector3(
            Math.cos(angle) * r,
            height,
            Math.sin(angle) * r
        );
        
        const particlePos = position.clone().add(offset);
        
        // 随机速度（缓慢漂浮）
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.2
        );
        
        // 随机大小
        const size = Math.random() * 1.5 + 0.5;
        
        // 随机寿命
        const lifespan = Math.random() * 5 + 5;
        
        // 添加粒子
        addParticle(particlePos, color, size, lifespan, velocity);
    }
}

// 创建成就粒子效果
function createAchievementParticles(position) {
    // 使用金色和白色
    const colors = [
        new THREE.Color(0xffd700), // 金色
        new THREE.Color(0xffffff)  // 白色
    ];
    
    for (let i = 0; i < 100; i++) {
        // 随机位置（在中心点周围）
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 3;
        
        const offset = new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        
        const particlePos = position.clone().add(offset);
        
        // 随机速度（向外扩散）
        const velocity = offset.clone().normalize().multiplyScalar(Math.random() * 2 + 1);
        
        // 随机颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机大小
        const size = Math.random() * 0.3 + 0.1;
        
        // 随机寿命
        const lifespan = Math.random() * 1 + 0.5;
        
        // 添加粒子
        addParticle(particlePos, color, size, lifespan, velocity);
    }
}

// 创建感恩爆发效果
function createGratitudeExplosion(position) {
    // 使用彩虹色
    const colors = [
        new THREE.Color(0xff0000), // 红色
        new THREE.Color(0xff9800), // 橙色
        new THREE.Color(0xffeb3b), // 黄色
        new THREE.Color(0x4caf50), // 绿色
        new THREE.Color(0x2196f3), // 蓝色
        new THREE.Color(0x9c27b0)  // 紫色
    ];
    
    for (let i = 0; i < 200; i++) {
        // 随机方向
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();
        
        // 随机速度
        const speed = Math.random() * 5 + 2;
        const velocity = direction.multiplyScalar(speed);
        
        // 随机颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机大小
        const size = Math.random() * 0.5 + 0.2;
        
        // 随机寿命
        const lifespan = Math.random() * 2 + 1;
        
        // 添加粒子
        addParticle(position.clone(), color, size, lifespan, velocity);
    }
}

// 导出函数
export {
    initParticles,
    updateParticles,
    createTreeParticles,
    createSeedParticles,
    createDoorParticles,
    createFogParticles,
    createAchievementParticles,
    createGratitudeExplosion
};