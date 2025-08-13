// Enhanced Device-Specific JavaScript for Wild Kernels

// Device Detection and Initialization
class DeviceManager {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = !this.isMobile && !this.isTablet;
        
        this.init();
    }
    
    init() {
        // Set device classes
        document.documentElement.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
        
        if (this.isMobile) {
            document.documentElement.classList.add('mobile-device');
        } else if (this.isTablet) {
            document.documentElement.classList.add('tablet-device');
        } else {
            document.documentElement.classList.add('desktop-device');
        }
        
        // Initialize device-specific features
        this.setupDeviceSpecificFeatures();
    }
    
    setupDeviceSpecificFeatures() {
        if (this.isMobile) {
            this.setupMobileFeatures();
        } else {
            this.setupDesktopFeatures();
        }
    }
    
    setupMobileFeatures() {
        // Mobile-specific optimizations
        this.enableTouchOptimizations();
        this.setupMobileNavigation();
        this.optimizeMobileAnimations();
    }
    
    setupDesktopFeatures() {
        // Desktop-specific features
        this.enableDesktopAnimations();
        this.setupParallaxEffects();
        this.enableHoverEffects();
    }
    
    enableTouchOptimizations() {
        // Add touch-friendly classes
        document.body.classList.add('touch-optimized');
        
        // Increase touch targets
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '48px';
            btn.style.minWidth = '48px';
        });
    }
    
    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking on links
            const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }
    
    optimizeMobileAnimations() {
        // Reduce animations on mobile for better performance
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device .floating-card {
                animation: none !important;
            }
            .mobile-device * {
                transition-duration: 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableDesktopAnimations() {
        // Enhanced desktop animations
        this.setupFloatingCards();
        this.setupMouseFollower();
    }
    
    setupFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            // Add random floating animation delays
            const delay = Math.random() * 2;
            card.style.animationDelay = `${delay}s`;
            
            // Add mouse interaction
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    setupMouseFollower() {
        if (!this.isMobile) {
            let mouseX = 0, mouseY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            // Create subtle mouse follower effect
            const follower = document.createElement('div');
            follower.className = 'mouse-follower';
            follower.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(76, 175, 80, 0.3), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(follower);
            
            const updateFollower = () => {
                follower.style.left = mouseX - 10 + 'px';
                follower.style.top = mouseY - 10 + 'px';
                requestAnimationFrame(updateFollower);
            };
            updateFollower();
        }
    }
    
    setupParallaxEffects() {
        if (!this.isMobile) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.floating-card');
                
                parallaxElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            });
        }
    }
    
    enableHoverEffects() {
        // Enhanced hover effects for desktop
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.init();
    }
    
    init() {
        // Simulate loading time based on device
        const deviceManager = new DeviceManager();
        const loadTime = deviceManager.isMobile ? 1500 : 2000;
        
        setTimeout(() => {
            this.hideLoading();
        }, loadTime);
        
        // Also hide when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => this.hideLoading(), 500);
        });
    }
    
    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Navbar Manager
class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupSmoothScrolling();
    }
    
    setupScrollEffect() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on mobile
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupButtonRippleEffect();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate in
        const animatedElements = document.querySelectorAll('.fade-in, .hero-content, .floating-card');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    
    setupButtonRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.optimizeAnimations();
    }
    
    optimizeImages() {
        // Add loading="lazy" to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    setupLazyLoading() {
        // Lazy load non-critical elements
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.dataset.lazy;
                    
                    if (src) {
                        element.src = src;
                        element.removeAttribute('data-lazy');
                    }
                    
                    lazyObserver.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(el => lazyObserver.observe(el));
    }
    
    optimizeAnimations() {
        // Reduce animations if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupDynamicColors();
        this.setupResponsiveDesign();
    }
    
    setupDynamicColors() {
        // Add dynamic color variations based on time of day
        const hour = new Date().getHours();
        const root = document.documentElement;
        
        if (hour >= 6 && hour < 12) {
            // Morning - lighter greens
            root.style.setProperty('--primary-green', '#388E3C');
            root.style.setProperty('--secondary-green', '#66BB6A');
        } else if (hour >= 12 && hour < 18) {
            // Afternoon - standard greens
            root.style.setProperty('--primary-green', '#2E7D32');
            root.style.setProperty('--secondary-green', '#4CAF50');
        } else {
            // Evening/Night - darker greens
            root.style.setProperty('--primary-green', '#1B5E20');
            root.style.setProperty('--secondary-green', '#2E7D32');
        }
    }
    
    setupResponsiveDesign() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Reinitialize device detection
                new DeviceManager();
            }, 100);
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                new DeviceManager();
            }, 250);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new LoadingManager();
    new DeviceManager();
    new NavbarManager();
    new AnimationManager();
    new PerformanceManager();
    new ThemeManager();
    
    console.log('🌿 Wild Kernels website initialized with device-specific optimizations!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page is visible
        document.body.classList.remove('page-hidden');
    }
});

// Export for potential external use
window.WildKernels = {
    DeviceManager,
    LoadingManager,
    NavbarManager,
    AnimationManager,
    PerformanceManager,
    ThemeManager
};