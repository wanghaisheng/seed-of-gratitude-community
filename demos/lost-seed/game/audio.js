// 音频设置
let audioSettings = {
    musicVolume: 0.3,
    sfxVolume: 0.5
};

// 音频元素缓存
const audioElements = {};

// 初始化音频
function initAudio(settings) {
    // 更新设置
    audioSettings = settings;
    
    // 设置背景音乐音量
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.volume = audioSettings.musicVolume;
        bgMusic.loop = true;
    }
    
    // 预加载音效
    preloadSounds();
}

// 预加载音效
function preloadSounds() {
    const sounds = [
        { id: 'ui-click-sound', src: 'assets/sounds/ui_click.mp3' },
        { id: 'seed-collect-sound', src: 'assets/sounds/seed_collect.mp3' },
        { id: 'tree-awaken-sound', src: 'assets/sounds/tree_awaken.mp3' },
        { id: 'door-unlock-sound', src: 'assets/sounds/door_unlock.mp3' },
        { id: 'achievement-sound', src: 'assets/sounds/achievement.mp3' },
        { id: 'journal-write-sound', src: 'assets/sounds/journal_write.mp3' },
        { id: 'ambient-forest-sound', src: 'assets/sounds/ambient_forest.mp3' }
    ];
    
    sounds.forEach(sound => {
        // 检查是否已经存在音频元素
        let audioElement = document.getElementById(sound.id);
        
        // 如果不存在，创建新的音频元素
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = sound.id;
            audioElement.src = sound.src;
            audioElement.preload = 'auto';
            document.body.appendChild(audioElement);
        }
        
        // 缓存音频元素
        audioElements[sound.id] = audioElement;
    });
}

// 播放音效
function playSound(soundId) {
    const sound = audioElements[soundId];
    
    if (sound) {
        // 设置音量
        sound.volume = audioSettings.sfxVolume;
        
        // 重置播放位置
        sound.currentTime = 0;
        
        // 播放音效
        sound.play().catch(error => {
            console.warn(`无法播放音效 ${soundId}:`, error);
        });
    } else {
        console.warn(`找不到音效: ${soundId}`);
    }
}

// 播放背景音乐
function playBackgroundMusic() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.volume = audioSettings.musicVolume;
        bgMusic.play().catch(error => {
            console.warn('无法播放背景音乐:', error);
        });
    }
}

// 暂停背景音乐
function pauseBackgroundMusic() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.pause();
    }
}

// 更新音频设置
function updateAudioSettings(settings) {
    audioSettings = settings;
    
    // 更新背景音乐音量
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.volume = audioSettings.musicVolume;
    }
}

// 导出函数
export {
    initAudio,
    playSound,
    playBackgroundMusic,
    pauseBackgroundMusic,
    updateAudioSettings
};