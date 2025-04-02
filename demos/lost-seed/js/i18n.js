// 多语言支持
let currentLanguage = 'zh'; // 默认语言
let translations = {}; // 翻译数据

// 初始化多语言支持
function initI18n() {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0];
    
    // 检查本地存储中是否有保存的语言设置
    const savedLang = localStorage.getItem('language');
    
    // 设置初始语言
    if (savedLang && isLanguageSupported(savedLang)) {
        currentLanguage = savedLang;
    } else if (isLanguageSupported(browserLang)) {
        currentLanguage = browserLang;
    }
    
    // 加载翻译数据
    loadTranslations(currentLanguage)
        .then(() => {
            // 更新语言选择器
            updateLanguageSelector();
            
            // 应用翻译
            applyTranslations();
        })
        .catch(error => {
            console.error('加载翻译数据失败:', error);
        });
    
    // 语言选择器事件监听
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const newLang = this.value;
            
            if (newLang !== currentLanguage) {
                changeLanguage(newLang);
            }
        });
    }
}

// 检查语言是否支持
function isLanguageSupported(lang) {
    return ['zh', 'en', 'ja', 'ko'].includes(lang);
}

// 加载翻译数据
function loadTranslations(lang) {
    return fetch(`locale/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data;
        });
}

// 更新语言选择器
function updateLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

// 应用翻译
function applyTranslations() {
    // 翻译文本内容
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // 翻译属性
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const attr = element.getAttribute('data-i18n-attr');
        
        if (translations[key] && attr) {
            element.setAttribute(attr, translations[key]);
        }
    });
    
    // 更新HTML标题
    if (translations['page_title']) {
        document.title = translations['page_title'];
    }
    
    // 更新meta标签
    document.querySelectorAll('meta[data-i18n]').forEach(meta => {
        const key = meta.getAttribute('data-i18n');
        
        if (translations[key]) {
            meta.setAttribute('content', translations[key]);
        }
    });
}

// 切换语言
function changeLanguage(lang) {
    if (isLanguageSupported(lang) && lang !== currentLanguage) {
        currentLanguage = lang;
        
        // 保存语言设置
        localStorage.setItem('language', lang);
        
        // 加载新语言的翻译数据
        loadTranslations(lang)
            .then(() => {
                // 应用翻译
                applyTranslations();
            })
            .catch(error => {
                console.error('加载翻译数据失败:', error);
            });
    }
}

// 导出函数
window.changeLanguage = changeLanguage;