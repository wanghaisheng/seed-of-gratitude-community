document.addEventListener('DOMContentLoaded', function() {
    // 初始化加载动画
    initLoader();
    
    // 初始化移动菜单
    initMobileMenu();
    
    // 初始化滚动动画
    initScrollReveal();
    
    // 初始化截图滑块
    initScreenshotsSlider();
    
    // 初始化FAQ折叠面板
    initFaqAccordion();
    
    // 初始化倒计时
    initCountdown();
    
    // 初始化视频播放
    initVideoPlayer();
    
    // 初始化多语言支持
    initI18n();
});

// 加载动画
function initLoader() {
    const loader = document.querySelector('.loader');
    
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
            }, 500);
        });
    }
}

// 移动菜单
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    if (menuToggle && mobileMenu) {
        // 打开菜单
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // 关闭菜单
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // 点击链接后关闭菜单
        mobileMenuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// 滚动动画
function initScrollReveal() {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    function revealElements() {
        const windowHeight = window.innerHeight;
        
        scrollRevealElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }
    
    // 初始检查
    revealElements();
    
    // 滚动时检查
    window.addEventListener('scroll', revealElements);
}

// 截图滑块
function initScreenshotsSlider() {
    const slider = document.querySelector('.screenshots-slider');
    const slides = document.querySelectorAll('.screenshot');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevButton = document.querySelector('.slider-arrows .prev');
    const nextButton = document.querySelector('.slider-arrows .next');
    
    if (slider && slides.length > 0) {
        let currentSlide = 0;
        
        // 隐藏所有幻灯片，只显示当前幻灯片
        function showSlide(index) {
            slides.forEach(function(slide, i) {
                slide.style.display = i === index ? 'block' : 'none';
            });
            
            // 更新指示点
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // 初始显示第一张幻灯片
        showSlide(currentSlide);
        
        // 下一张幻灯片
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // 上一张幻灯片
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // 点击下一张按钮
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        
        // 点击上一张按钮
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        // 点击指示点
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                currentSlide = i;
                showSlide(currentSlide);
            });
        });
        
        // 自动播放
        let slideInterval = setInterval(nextSlide, 5000);
        
        // 鼠标悬停时暂停自动播放
        slider.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        // 鼠标离开时恢复自动播放
        slider.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// FAQ折叠面板
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                // 切换当前项的展开/折叠状态
                item.classList.toggle('active');
                
                // 更新图标
                if (item.classList.contains('active')) {
                    toggle.innerHTML = '<i class="fas fa-minus"></i>';
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    toggle.innerHTML = '<i class="fas fa-plus"></i>';
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
}

// 倒计时
function initCountdown() {
    const daysElement = document.querySelector('.countdown-value.days');
    const hoursElement = document.querySelector('.countdown-value.hours');
    const minutesElement = document.querySelector('.countdown-value.minutes');
    const secondsElement = document.querySelector('.countdown-value.seconds');
    
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        // 设置倒计时结束日期（当前日期 + 3天）
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        
        function updateCountdown() {
            const now = new Date();
            const diff = endDate - now;
            
            // 如果倒计时结束
            if (diff <= 0) {
                daysElement.textContent = '0';
                hoursElement.textContent = '0';
                minutesElement.textContent = '0';
                secondsElement.textContent = '0';
                return;
            }
            
            // 计算剩余时间
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // 更新显示
            daysElement.textContent = days;
            hoursElement.textContent = hours < 10 ? '0' + hours : hours;
            minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
            secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
        }
        
        // 初始更新
        updateCountdown();
        
        // 每秒更新一次
        setInterval(updateCountdown, 1000);
    }
}

// 视频播放
function initVideoPlayer() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = document.querySelector('.play-button');
    
    if (videoPlaceholder && playButton) {
        playButton.addEventListener('click', function() {
            // 创建视频元素
            const videoElement = document.createElement('iframe');
            videoElement.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'; // 替换为实际视频链接
            videoElement.width = '100%';
            videoElement.height = '100%';
            videoElement.frameBorder = '0';
            videoElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            videoElement.allowFullscreen = true;
            
            // 替换占位符
            videoPlaceholder.innerHTML = '';
            videoPlaceholder.appendChild(videoElement);
        });
    }
}

// 返回顶部按钮
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // 点击返回顶部
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Cookie同意提示
function initCookieConsent() {
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptButton = document.querySelector('.cookie-btn.accept');
    const settingsButton = document.querySelector('.cookie-btn.settings');
    
    if (cookieConsent && acceptButton) {
        // 检查是否已经接受Cookie
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        
        if (!cookiesAccepted) {
            // 显示Cookie提示
            setTimeout(function() {
                cookieConsent.classList.add('visible');
            }, 1000);
            
            // 接受所有Cookie
            acceptButton.addEventListener('click', function() {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieConsent.classList.remove('visible');
            });
            
            // Cookie设置
            if (settingsButton) {
                settingsButton.addEventListener('click', function() {
                    // 这里可以打开Cookie设置面板
                    console.log('打开Cookie设置');
                });
            }
        }
    }
}

// 初始化Cookie同意提示
initCookieConsent();

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // 考虑导航栏高度
                behavior: 'smooth'
            });
        }
    });
});

// 浮动种子动画
function initFloatingSeeds() {
    const seeds = document.querySelectorAll('.floating-seed');
    
    seeds.forEach(seed => {
        // 随机初始位置
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        
        // 随机动画持续时间
        const duration = 3 + Math.random() * 2;
        
        // 设置CSS变量
        seed.style.setProperty('--x', `${randomX}px`);
        seed.style.setProperty('--y', `${randomY}px`);
        seed.style.setProperty('--duration', `${duration}s`);
        
        // 添加动画类
        seed.classList.add('animate');
    });
}

// 初始化浮动种子动画
initFloatingSeeds();

// 粒子效果
function initParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        // 创建粒子
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // 随机位置
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // 随机大小
            const size = Math.random() * 5 + 2;
            
            // 随机透明度
            const opacity = Math.random() * 0.5 + 0.3;
            
            // 随机动画持续时间
            const duration = Math.random() * 20 + 10;
            
            // 设置样式
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            
            // 添加到容器
            heroParticles.appendChild(particle);
        }
    }
}

// 初始化粒子效果
initParticles();