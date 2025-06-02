
// Global variables
let isScrolled = false;
let isMobileMenuOpen = false;
let loadingProgress = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeIntersectionObserver();
    initializeCodeEditor();
});

// Loading screen functionality
function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingCommand = document.getElementById('loadingCommand');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const commands = [
        'npm install portfolio-dependencies',
        'Initializing development server...',
        'Loading React components...',
        'Compiling TypeScript...',
        'Starting portfolio application...'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    
    function typeCommand() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];
            
            if (charIndex < currentCommand.length) {
                loadingCommand.textContent = currentCommand.slice(0, charIndex + 1);
                charIndex++;
                setTimeout(typeCommand, 50);
            } else {
                // Command complete, update progress
                loadingProgress = ((commandIndex + 1) / commands.length) * 100;
                progressBar.style.setProperty('--progress', loadingProgress + '%');
                progressBar.querySelector('::after') && (progressBar.style.width = loadingProgress + '%');
                progressText.textContent = Math.round(loadingProgress) + '%';
                
                // Move to next command
                commandIndex++;
                charIndex = 0;
                setTimeout(typeCommand, 800);
            }
        } else {
            // All commands complete, hide loading screen
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 1000);
        }
    }
    
    // Start typing animation
    setTimeout(typeCommand, 1000);
    
    // Animate progress bar
    const style = document.createElement('style');
    style.textContent = `
        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: var(--primary-color);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const heroButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    // Handle scroll effects on navbar
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50 && !isScrolled) {
            navbar.classList.add('scrolled');
            isScrolled = true;
        } else if (scrollY <= 50 && isScrolled) {
            navbar.classList.remove('scrolled');
            isScrolled = false;
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            isMobileMenuOpen = !isMobileMenuOpen;
            
            if (isMobileMenuOpen) {
                mobileMenu.classList.add('show');
                mobileMenu.style.display = 'flex';
                
                // Animate hamburger to X
                const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
                hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                hamburgers[1].style.opacity = '0';
                hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                mobileMenu.classList.remove('show');
                mobileMenu.style.display = 'none';
                
                // Reset hamburger
                const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
                hamburgers[0].style.transform = 'none';
                hamburgers[1].style.opacity = '1';
                hamburgers[2].style.transform = 'none';
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            scrollToSection(sectionId);
            
            // Close mobile menu if open
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    });

    // Hero button functionality
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                scrollToSection(sectionId);
            }
        });
    });
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    isMobileMenuOpen = false;
    mobileMenu.classList.remove('show');
    mobileMenu.style.display = 'none';
    
    const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
    hamburgers[0].style.transform = 'none';
    hamburgers[1].style.opacity = '1';
    hamburgers[2].style.transform = 'none';
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Code editor animation
function initializeCodeEditor() {
    const codeLines = [
        'import React from "react";',
        'import { useState } from "react";',
        '',
        'const Portfolio = () => {',
        '  return <div>Hello World!</div>;'
    ];
    
    const codeElements = [
        document.getElementById('codeLine1'),
        document.getElementById('codeLine2'),
        document.getElementById('codeLine3'),
        document.getElementById('codeLine4'),
        document.getElementById('codeLine5')
    ];
    
    function typeCodeLine(lineIndex, charIndex = 0) {
        if (lineIndex >= codeLines.length) return;
        
        const currentLine = codeLines[lineIndex];
        const currentElement = codeElements[lineIndex];
        
        if (!currentElement) return;
        
        if (charIndex <= currentLine.length) {
            currentElement.innerHTML = highlightSyntax(currentLine.slice(0, charIndex));
            
            if (charIndex < currentLine.length) {
                setTimeout(() => typeCodeLine(lineIndex, charIndex + 1), 50);
            } else {
                setTimeout(() => typeCodeLine(lineIndex + 1), 300);
            }
        }
    }
    
    function highlightSyntax(code) {
        return code
            .replace(/import|from|const|return/g, '<span class="code-keyword">$&</span>')
            .replace(/"[^"]*"/g, '<span class="code-string">$&</span>')
            .replace(/React|useState|Portfolio/g, '<span class="code-variable">$&</span>')
            .replace(/=/g, '<span class="code-operator">$&</span>')
            .replace(/[{}()]/g, '<span class="code-bracket">$&</span>');
    }
    
    // Start typing animation after a delay
    setTimeout(() => typeCodeLine(0), 2000);
}

// Intersection Observer for scroll animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate skill progress bars
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        setTimeout(() => {
                            progressBar.style.width = progressBar.style.width;
                        }, 300);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .terminal-window, .section-header');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Scroll animations for elements
function initializeScrollAnimations() {
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-code');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification(`Thank you for your message, ${name}! I'll get back to you soon.`, 'success');
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                this.reset();
            }, 2000);
        });
        
        // Form input animations
        const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        font-family: var(--font-mono);
        font-size: 0.875rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.borderColor = 'var(--primary-color)';
        notification.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--accent-color)';
        notification.style.backgroundColor = 'rgba(255, 0, 128, 0.1)';
    }
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Performance optimization: Throttle function
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Add resize handler for responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Add smooth hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.skill-card, .project-card, .nav-link, .project-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Console easter egg
console.log('%c👨‍💻 Welcome to Praveen\'s Portfolio!', 'color: #00ff88; font-size: 16px; font-weight: bold; font-family: monospace;');
console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'color: #0099ff; font-size: 14px; font-family: monospace;');
console.log('%c📧 Interested in working together? Let\'s connect!', 'color: #ff0080; font-size: 14px; font-family: monospace;');

// Initialize skill progress animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Trigger skill animation when about section is visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateSkillBars, 500);
                aboutObserver.unobserve(entry.target);
            }
        });
    });
    
    aboutObserver.observe(aboutSection);
}
