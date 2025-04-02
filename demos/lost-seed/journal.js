import { addSeed } from './main.js';
import { showMessage } from './ui.js';

// 感恩提示
const gratitudePrompts = {
    personal: [
        "今天，我对自己的哪些方面感到感恩？",
        "我最近取得了什么进步让我感到自豪？",
        "我的身体给了我什么礼物？",
        "我拥有哪些让我感到幸福的特质？",
        "今天我做了什么善待自己的事情？"
    ],
    relationships: [
        "今天，谁给了我帮助或支持？",
        "我的生活中有哪些人让我感到感恩？",
        "最近谁的行为触动了我的心？",
        "我从哪些人身上学到了重要的东西？",
        "谁让我今天露出了微笑？"
    ],
    achievements: [
        "我最近克服了什么困难？",
        "我完成了什么让我感到自豪的事情？",
        "我最近学会了什么新技能？",
        "我今天做出了什么积极的决定？",
        "我最近的哪些努力得到了回报？"
    ],
    learning: [
        "我今天学到了什么新东西？",
        "什么经历让我有所成长？",
        "我从最近的挑战中获得了什么智慧？",
        "什么书籍或文章给了我启发？",
        "我最近意识到了什么重要的道理？"
    ],
    nature: [
        "今天，大自然的什么景象让我感到美丽？",
        "什么自然现象让我感到敬畏？",
        "我享受了哪些来自大自然的礼物？",
        "什么季节性的变化让我感到欣喜？",
        "我与自然连接的哪个时刻让我感到平静？"
    ]
};

// 初始化日记
function initJournal() {
    // 获取元素
    const categories = document.querySelectorAll('.category-tab');
    const prompts = document.getElementById('gratitude-prompts');
    const entry = document.getElementById('gratitude-entry');
    const saveButton = document.getElementById('save-entry');
    
    // 设置初始提示
    updatePrompt('personal');
    
    // 设置分类点击事件
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // 移除所有active类
            categories.forEach(c => c.classList.remove('active'));
            // 添加active类到当前分类
            category.classList.add('active');
            // 更新提示
            updatePrompt(category.dataset.category);
        });
    });
    
    // 设置保存按钮点击事件
    saveButton.addEventListener('click', saveEntry);
    
    // 设置回车键保存
    entry.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            saveEntry();
        }
    });
}

// 更新提示
function updatePrompt(category) {
    const promptsContainer = document.getElementById('gratitude-prompts');
    const prompts = gratitudePrompts[category] || gratitudePrompts.personal;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // 更新提示文本
    promptsContainer.innerHTML = `<div class="prompt active">${randomPrompt}</div>`;
}

// 保存条目
function saveEntry() {
    const entryText = document.getElementById('gratitude-entry').value.trim();
    
    if (entryText.length < 5) {
        showMessage('条目太短', '请至少写5个字的感恩内容。');
        return;
    }
    
    // 获取当前选中的分类
    let category = 'personal';
    const activeCategory = document.querySelector('.category-tab.active');
    if (activeCategory) {
        category = activeCategory.dataset.category;
    }
    
    // 创建种子数据
    const seedData = {
        id: Date.now(),
        type: getSeedTypeFromCategory(category),
        entry: entryText,
        date: new Date().toLocaleDateString(),
        category: category
    };
    
    // 添加种子
    addSeed(seedData);
    
    // 清空输入框
    document.getElementById('gratitude-entry').value = '';
    
    // 更新提示
    updatePrompt(category);
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

// 导出函数
export {
    initJournal,
    updatePrompt,
    gratitudePrompts
};