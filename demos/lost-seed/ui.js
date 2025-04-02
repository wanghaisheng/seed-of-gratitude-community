import { gameState, addSeed, awakenTree, getSeedColor, getSeedTypeName } from './main.js';
import { playSound } from './audio.js';

// UI元素引用
let uiElements = {};

// 当前选中的种子
let selectedSeed = null;

// 教程数据
const tutorialData = [
    {
        title: '欢迎来到遗忘森林',
        text: '在这片被迷雾笼罩的古老森林中，希望之树静静等待被唤醒。作为艾瑞恩，你的使命是通过记录感恩来收集希望种子，唤醒沉睡的希望之树，最终开启幸福之门。',
        image: 'assets/images/tutorial_welcome.png'
    },
    {
        title: '感恩日记',
        text: '使用感恩日记记录你的感恩。每次记录都会产生一颗希望种子。尝试不同类型的感恩，会产生不同类型的种子。',
        image: 'assets/images/tutorial_journal.png'
    },
    {
        title: '希望种子',
        text: '收集到的希望种子会显示在你的背包中。你可以使用这些种子来唤醒沉睡的希望之树。不同类型的树需要对应类型的种子。',
        image: 'assets/images/tutorial_seeds.png'
    },
    {
        title: '探索森林',
        text: '随着你唤醒更多的希望之树，森林的迷雾将逐渐散去，揭示更多隐藏的区域。当所有希望之树都被唤醒，幸福之门将开启，通往新的区域。',
        image: 'assets/images/tutorial_explore.png'
    }
];

// 当前教程步骤
let currentTutorialStep = 0;

// 初始化UI
function initUI(state) {
    // 获取UI元素引用
    uiElements = {
        // 面板
        inventoryPanel: document.getElementById('inventory-panel'),
        mapPanel: document.getElementById('map-panel'),
        settingsPanel: document.getElementById('settings-panel'),
        helpPanel: document.getElementById('help-panel'),
        characterInfoPanel: document.getElementById('character-info-panel'),
        seedDetailPanel: document.getElementById('seed-detail-panel'),
        lorePanel: document.getElementById('lore-panel'),
        messageBox: document.getElementById('message-box'),
        tutorialOverlay: document.getElementById('tutorial-overlay'),
        
        // 按钮
        inventoryButton: document.getElementById('inventory-button'),
        mapButton: document.getElementById('map-button'),
        settingsButton: document.getElementById('settings-button'),
        helpButton: document.getElementById('help-button'),
        characterInfoButton: document.querySelector('.character-info-button'),
        showMoreLoreButton: document.getElementById('show-more-lore'),
        startJourneyButton: document.getElementById('start-journey'),
        
        // 日记相关
        gratitudeCategories: document.querySelectorAll('.category-tab'),
        gratitudePrompts: document.querySelectorAll('.prompt'),
        gratitudeEntry: document.getElementById('gratitude-entry'),
        saveEntryButton: document.getElementById('save-entry'),
        seedsList: document.getElementById('seeds-list'),
        
        // 背包相关
        inventoryTabs: document.querySelectorAll('.inventory-tab'),
        inventoryContents: document.querySelectorAll('.inventory-content'),
        seedGrid: document.querySelector('.seed-grid'),
        seedFilters: document.querySelectorAll('.seed-filter'),
        journalEntries: document.getElementById('journal-entries'),
        
        // 地图相关
        mapSvg: document.getElementById('map-svg'),
        mapMarkers: document.querySelectorAll('.map-marker'),
        
        // 设置相关
        fogDensity: document.getElementById('fog-density'),
        seedGlow: document.getElementById('seed-glow'),
        musicVolume: document.getElementById('music-volume'),
        sfxVolume: document.getElementById('sfx-volume'),
        languageSelect: document.getElementById('language-select'),
        tutorialToggle: document.getElementById('tutorial-toggle'),
        
        // 帮助相关
        helpTabs: document.querySelectorAll('.help-tab'),
        helpContents: document.querySelectorAll('.help-content'),
        
        // 世界观相关
        loreTabs: document.querySelectorAll('.lore-tab'),
        loreContents: document.querySelectorAll('.lore-content'),
        
        // 种子详情相关
        seedVisual: document.getElementById('seed-visual'),
        seedDate: document.getElementById('seed-date'),
        seedTypeBadge: document.getElementById('seed-type-badge'),
        seedEntry: document.getElementById('seed-entry'),
        plantSeedButton: document.getElementById('plant-seed'),
        offerSeedButton: document.getElementById('offer-seed'),
        
        // 教程相关
        tutorialTitle: document.getElementById('tutorial-title'),
        tutorialText: document.getElementById('tutorial-text'),
        tutorialImage: document.querySelector('.tutorial-image'),
        tutorialPrevButton: document.getElementById('tutorial-prev'),
        tutorialNextButton: document.getElementById('tutorial-next'),
        tutorialDots: document.querySelectorAll('.dot'),
        tutorialCloseButton: document.getElementById('tutorial-close'),
        
        // 消息框相关
        messageTitle: document.getElementById('message-title'),
        messageText: document.getElementById('message-text'),
        messageCloseButton: document.getElementById('message-close'),
        
        // 状态显示
        treeStatus: document.getElementById('tree-status'),
        treeProgressFill: document.querySelector('.progress-fill'),
        treeProgressText: document.querySelector('.progress-text'),
        doorStatus: document.getElementById('door-status'),
        
        // 统计数据
        gratitudeCount: document.getElementById('gratitude-count'),
        seedCount: document.getElementById('seed-count'),
        treeCount: document.getElementById('tree-count')
    };
    
    // 设置事件监听器
    setupEventListeners();
    
    // 更新UI显示
    updateUI(state);
}

// 设置事件监听器
function setupEventListeners() {
    // 面板开关按钮
    uiElements.inventoryButton.addEventListener('click', () => togglePanel(uiElements.inventoryPanel));
    uiElements.mapButton.addEventListener('click', () => togglePanel(uiElements.mapPanel));
    uiElements.settingsButton.addEventListener('click', () => togglePanel(uiElements.settingsPanel));
    uiElements.helpButton.addEventListener('click', () => togglePanel(uiElements.helpPanel));
    uiElements.characterInfoButton.addEventListener('click', () => togglePanel(uiElements.characterInfoPanel));
    uiElements.showMoreLoreButton.addEventListener('click', () => togglePanel(uiElements.lorePanel));
    
    // 关闭按钮
    document.querySelectorAll('.close-panel').forEach(button => {
        button.addEventListener('click', (e) => {
            const panel = e.target.closest('.game-panel');
            if (panel) panel.classList.add('hidden');
            playSound('ui-click-sound');
        });
    });
    
    // 开始旅程按钮
    uiElements.startJourneyButton.addEventListener('click', () => {
        document.getElementById('intro-overlay').classList.add('hidden');
        
        // 如果启用了教程，显示教程
        if (gameState.settings.showTutorials) {
            setTimeout(() => {
                uiElements.tutorialOverlay.classList.remove('hidden');
                updateTutorialStep(0);
            }, 500);
        }
        
        playSound('ui-click-sound');
    });
    
    // 日记分类标签
    uiElements.gratitudeCategories.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的active类
            uiElements.gratitudeCategories.forEach(t => t.classList.remove('active'));
            // 给当前标签添加active类
            tab.classList.add('active');
            
            // 更新提示
            const category = tab.dataset.category;
            uiElements.gratitudePrompts.forEach(prompt => {
                prompt.classList.remove('active');
                if (prompt.dataset.category === category) {
                    prompt.classList.add('active');
                }
            });
            
            playSound('ui-click-sound');
        });
    });
    
    // 保存感恩条目按钮
    uiElements.saveEntryButton.addEventListener('click', saveGratitudeEntry);
    
    // 背包标签
    uiElements.inventoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // 更新标签状态
            uiElements.inventoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            uiElements.inventoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-inventory`) {
                    content.classList.add('active');
                }
            });
            
            playSound('ui-click-sound');
        });
    });
    
    // 种子过滤器
    uiElements.seedFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.dataset.type;
            
            // 更新过滤器状态
            uiElements.seedFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            // 更新种子显示
            updateSeedGrid(filterType);
            
            playSound('ui-click-sound');
        });
    });
    
    // 帮助标签
    uiElements.helpTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // 更新标签状态
            uiElements.helpTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            uiElements.helpContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-help`) {
                    content.classList.add('active');
                }
            });
            
            playSound('ui-click-sound');
        });
    });
    
    // 世界观标签
    uiElements.loreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // 更新标签状态
            uiElements.loreTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新内容显示
            uiElements.loreContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-lore-content`) {
                    content.classList.add('active');
                }
            });
            
            playSound('ui-click-sound');
        });
    });
    
    // 种植种子按钮
    uiElements.plantSeedButton.addEventListener('click', () => {
        if (selectedSeed) {
            // 找到对应类型的树
            const tree = gameState.trees.find(t => t.type === selectedSeed.type && t.status === 'asleep');
            
            if (tree) {
                // 唤醒树木
                awakenTree(tree.id);
                
                // 从背包中移除种子
                const seedIndex = gameState.seeds.findIndex(s => s.id === selectedSeed.id);
                if (seedIndex !== -1) {
                    gameState.seeds.splice(seedIndex, 1);
                }
                
                // 关闭种子详情面板
                uiElements.seedDetailPanel.classList.add('hidden');
                
                // 更新UI
                updateUI(gameState);
                
                // 显示消息
                showMessage('种子已种植', `你成功地将${getSeedTypeName(selectedSeed.type)}种植在了${tree.name}旁边，树木开始苏醒！`);
            } else {
                showMessage('无法种植', '没有找到适合这种类型种子的沉睡树木。');
            }
        }
    });
    
    // 奉献种子按钮
    uiElements.offerSeedButton.addEventListener('click', () => {
        if (selectedSeed) {
            // 从背包中移除种子
            const seedIndex = gameState.seeds.findIndex(s => s.id === selectedSeed.id);
            if (seedIndex !== -1) {
                gameState.seeds.splice(seedIndex, 1);
            }
            
            // 关闭种子详情面板
            uiElements.seedDetailPanel.classList.add('hidden');
            
            // 更新UI
            updateUI(gameState);
            
            // 显示种子收集动画
            showSeedCollectionAnimation(selectedSeed.entry);
            
            // 显示消息
            showMessage('种子已奉献', `你将${getSeedTypeName(selectedSeed.type)}奉献给了希望之神，她对你的感恩之心感到欣慰。`);
            
            // 随机给予奖励
            giveRandomReward();
        }
    });
    
    // 消息框关闭按钮
    uiElements.messageCloseButton.addEventListener('click', () => {
        uiElements.messageBox.classList.add('hidden');
        playSound('ui-click-sound');
    });
    
    // 教程按钮
    uiElements.tutorialPrevButton.addEventListener('click', () => {
        updateTutorialStep(currentTutorialStep - 1);
        playSound('ui-click-sound');
    });
    
    uiElements.tutorialNextButton.addEventListener('click', () => {
        updateTutorialStep(currentTutorialStep + 1);
        playSound('ui-click-sound');
    });
    
    uiElements.tutorialCloseButton.addEventListener('click', () => {
        uiElements.tutorialOverlay.classList.add('hidden');
        playSound('ui-click-sound');
    });
    
    // 设置滑块
    uiElements.fogDensity.addEventListener('input', updateSettings);
    uiElements.seedGlow.addEventListener('input', updateSettings);
    uiElements.musicVolume.addEventListener('input', updateSettings);
    uiElements.sfxVolume.addEventListener('input', updateSettings);
    uiElements.languageSelect.addEventListener('change', updateSettings);
    uiElements.tutorialToggle.addEventListener('change', updateSettings);
}

// 切换面板显示
function togglePanel(panel) {
    // 隐藏所有面板
    document.querySelectorAll('.game-panel').forEach(p => {
        if (p !== panel) p.classList.add('hidden');
    });
    
    // 切换当前面板
    panel.classList.toggle('hidden');
    
    // 播放UI点击音效
    playSound('ui-click-sound');
}

// 保存感恩条目
function saveGratitudeEntry() {
    const entryText = uiElements.gratitudeEntry.value.trim();
    
    if (entryText.length < 5) {
        showMessage('条目太短', '请至少写5个字的感恩内容。');
        return;
    }
    
    // 获取当前选中的分类
    let category = 'personal';
    uiElements.gratitudeCategories.forEach(tab => {
        if (tab.classList.contains('active')) {
            category = tab.dataset.category;
        }
    });
    
    // 创建新的种子数据
    const seedData = {
        id: Date.now(),
        type: getSeedTypeFromCategory(category),
        entry: entryText,
        date: new Date().toLocaleDateString(),
        category: category
    };
    
    // 添加种子到游戏状态
    addSeed(seedData);
    
    // 增加感恩计数
    gameState.gratitudeCount++;
    
    // 清空输入框
    uiElements.gratitudeEntry.value = '';
    
    // 显示种子收集动画
    showSeedCollectionAnimation(entryText);
    
    // 更新UI
    updateUI(gameState);
}

// 根据分类获取种子类型
function getSeedTypeFromCategory(category) {
    switch (category) {
        case 'personal': return 'gratitude';
        case 'relationships': return 'love';
        case 'achievements': return 'courage';
        case 'learning': return 'wisdom';
        case 'nature': return 'harmony';
        default: return 'gratitude';
    }
}

// 更新种子网格
function updateSeedGrid(filterType) {
    const seedGrid = uiElements.seedGrid;
    seedGrid.innerHTML = '';
    
    // 过滤种子
    let filteredSeeds = gameState.seeds;
    if (filterType !== 'all') {
        filteredSeeds = gameState.seeds.filter(seed => seed.type === filterType);
    }
    
    if (filteredSeeds.length === 0) {
        seedGrid.innerHTML = '<div class="empty-message">你还没有收集到这种类型的种子。</div>';
        return;
    }
    
    // 创建种子项
    filteredSeeds.forEach(seed => {
        const seedItem = document.createElement('div');
        seedItem.className = 'seed-item';
        seedItem.dataset.id = seed.id;
        
        const seedVisual = document.createElement('div');
        seedVisual.className = 'seed-visual';
        seedVisual.style.background = `#${getSeedColor(seed.type).toString(16)}`;
        
        seedItem.appendChild(seedVisual);
        seedItem.addEventListener('click', () => showSeedDetails(seed));
        
        seedGrid.appendChild(seedItem);
    });
}

// 显示种子详情
function showSeedDetails(seed) {
    selectedSeed = seed;
    
    // 更新种子视觉效果
    const seedVisual = uiElements.seedVisual.querySelector('.seed-3d');
    seedVisual.style.background = `#${getSeedColor(seed.type).toString(16)}`;
    
    // 更新种子信息
    uiElements.seedDate.textContent = seed.date;
    uiElements.seedTypeBadge.textContent = getSeedTypeName(seed.type);
    uiElements.seedEntry.textContent = seed.entry;
    
    // 检查是否有对应类型的沉睡树木
    const hasMatchingTree = gameState.trees.some(tree => tree.type === seed.type && tree.status === 'asleep');
    
    // 更新按钮状态
    uiElements.plantSeedButton.disabled = !hasMatchingTree;
    
    // 显示面板
    uiElements.seedDetailPanel.classList.remove('hidden');
    
    // 播放UI点击音效
    playSound('ui-click-sound');
}

// 显示种子收集动画
function showSeedCollectionAnimation(entryText) {
    const animationContainer = document.getElementById('seed-collection-animation');
    const gratitudeText = animationContainer.querySelector('.gratitude-text');
    
    // 设置感恩文本
    gratitudeText.textContent = entryText;
    
    // 显示动画
    animationContainer.classList.remove('hidden');
    
    // 播放收集种子的声音
    playSound('seed-collect-sound');
    
    // 3秒后隐藏动画
    setTimeout(() => {
        animationContainer.classList.add('hidden');
    }, 3000);
}

// 显示消息
function showMessage(title, text) {
    uiElements.messageTitle.textContent = title;
    uiElements.messageText.textContent = text;
    uiElements.messageBox.classList.remove('hidden');
}

// 更新教程步骤
function updateTutorialStep(step) {
    // 确保步骤在有效范围内
    if (step < 0 || step >= tutorialData.length) return;
    
    currentTutorialStep = step;
    
    // 更新教程内容
    uiElements.tutorialTitle.textContent = tutorialData[step].title;
    uiElements.tutorialText.textContent = tutorialData[step].text;
    uiElements.tutorialImage.style.backgroundImage = `url(${tutorialData[step].image})`;
    
    // 更新导航按钮状态
    uiElements.tutorialPrevButton.disabled = (step === 0);
    uiElements.tutorialNextButton.disabled = (step === tutorialData.length - 1);
    
    // 更新指示点
    uiElements.tutorialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === step);
    });
}

// 更新设置
function updateSettings() {
    // 更新游戏状态中的设置
    gameState.settings.fogDensity = parseFloat(uiElements.fogDensity.value);
    gameState.settings.seedGlow = parseFloat(uiElements.seedGlow.value);
    gameState.settings.musicVolume = parseFloat(uiElements.musicVolume.value);
    gameState.settings.sfxVolume = parseFloat(uiElements.sfxVolume.value);
    gameState.settings.language = uiElements.languageSelect.value;
    gameState.settings.showTutorials = uiElements.tutorialToggle.checked;
    
    // 应用音量设置
    document.getElementById('background-music').volume = gameState.settings.musicVolume;
    
    // 显示消息
    showMessage('设置已更新', '你的设置已成功保存。');
}

// 随机给予奖励
function giveRandomReward() {
    const rewards = [
        { type: 'lore', message: '希望之神向你揭示了一段遗忘之地的历史。' },
        { type: 'seed', message: '希望之神赐予你一颗特殊的种子作为回报。' },
        { type: 'fog', message: '希望之神减轻了一部分森林的迷雾。' }
    ];
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    switch (reward.type) {
        case 'lore':
            // 解锁一段新的世界观
            unlockRandomLore();
            break;
        case 'seed':
            // 给予一颗随机类型的种子
            giveRandomSeed();
            break;
        case 'fog':
            // 减轻迷雾
            reduceFog();
            break;
    }
    
    showMessage('神圣奖励', reward.message);
}

// 解锁随机世界观
function unlockRandomLore() {
    // 这里可以实现解锁新的世界观内容
    // 暂时只是一个占位函数
}

// 给予随机种子
function giveRandomSeed() {
    const types = ['gratitude', 'wisdom', 'courage', 'love', 'harmony'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const seedData = {
        id: Date.now(),
        type: randomType,
        entry: '这是希望之神赐予的神圣种子。',
        date: new Date().toLocaleDateString(),
        category: 'divine'
    };
    
    addSeed(seedData);
}

// 减轻迷雾
function reduceFog() {
    // 减少迷雾密度
    gameState.settings.fogDensity = Math.max(0.01, gameState.settings.fogDensity - 0.01);
    
    // 更新设置滑块
    uiElements.fogDensity.value = gameState.settings.fogDensity;
}

// 更新UI
function updateUI(state) {
    // 更新种子列表
    updateSeedsList(state.seeds);
    
    // 更新种子网格
    let activeFilter = 'all';
    uiElements.seedFilters.forEach(filter => {
        if (filter.classList.contains('active')) {
            activeFilter = filter.dataset.type;
        }
    });
    updateSeedGrid(activeFilter);
    
    // 更新树木状态
    const awakeTreeCount = state.trees.filter(tree => tree.status === 'awake').length;
    const totalTreeCount = state.trees.length;
    
    if (uiElements.treeStatus) {
        uiElements.treeStatus.textContent = `已唤醒 ${awakeTreeCount} / ${totalTreeCount} 棵希望之树`;
    }
    
    if (uiElements.treeProgressFill) {
        const progressPercentage = (awakeTreeCount / totalTreeCount) * 100;
        uiElements.treeProgressFill.style.width = `${progressPercentage}%`;
    }
    
    if (uiElements.treeProgressText) {
        uiElements.treeProgressText.textContent = `${Math.round((awakeTreeCount / totalTreeCount) * 100)}%`;
    }
    
    // 更新门状态
    if (uiElements.doorStatus) {
        uiElements.doorStatus.textContent = state.doorStatus === 'locked' ? '幸福之门：锁定' : '幸福之门：已开启';
        uiElements.doorStatus.style.color = state.doorStatus === 'locked' ? '#aaa' : '#ffd700';
    }
    
    // 更新统计数据
    if (uiElements.gratitudeCount) {
        uiElements.gratitudeCount.textContent = state.gratitudeCount;
    }
    
    if (uiElements.seedCount) {
        uiElements.seedCount.textContent = state.seeds.length;
    }
    
    if (uiElements.treeCount) {
        uiElements.treeCount.textContent = awakeTreeCount;
    }
    
    // 更新地图标记
    updateMapMarkers(state);
    
    // 更新设置滑块
    updateSettingsUI(state.settings);
}

// 更新种子列表
function updateSeedsList(seeds) {
    if (!uiElements.seedsList) return;
    
    uiElements.seedsList.innerHTML = '';
    
    // 显示最近的5颗种子
    const recentSeeds = seeds.slice(-5).reverse();
    
    recentSeeds.forEach(seed => {
        const seedIcon = document.createElement('div');
        seedIcon.className = 'seed-icon';
        seedIcon.style.background = `#${getSeedColor(seed.type).toString(16)}`;
        seedIcon.title = getSeedTypeName(seed.type);
        seedIcon.dataset.id = seed.id;
        
        seedIcon.addEventListener('click', () => showSeedDetails(seed));
        
        uiElements.seedsList.appendChild(seedIcon);
    });
}

// 更新地图标记
function updateMapMarkers(state) {
    if (!uiElements.mapMarkers) return;
    
    uiElements.mapMarkers.forEach(marker => {
        const treeId = parseInt(marker.dataset.treeId);
        if (!isNaN(treeId)) {
            const tree = state.trees.find(t => t.id === treeId);
            if (tree) {
                marker.classList.remove('main-tree', 'unlocked-tree', 'locked-tree');
                marker.classList.add(tree.status === 'awake' ? 'unlocked-tree' : 'locked-tree');
                
                if (tree.id === 0) {
                    marker.classList.add('main-tree');
                }
            }
        }
    });
}

// 更新设置UI
function updateSettingsUI(settings) {
    if (uiElements.fogDensity) uiElements.fogDensity.value = settings.fogDensity;
    if (uiElements.seedGlow) uiElements.seedGlow.value = settings.seedGlow;
    if (uiElements.musicVolume) uiElements.musicVolume.value = settings.musicVolume;
    if (uiElements.sfxVolume) uiElements.sfxVolume.value = settings.sfxVolume;
    if (uiElements.languageSelect) uiElements.languageSelect.value = settings.language;
    if (uiElements.tutorialToggle) uiElements.tutorialToggle.checked = settings.showTutorials;
}

// 导出函数
export {
    initUI,
    updateUI,
    showMessage,
    showSeedCollectionAnimation
};