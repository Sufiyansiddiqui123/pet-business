// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const galleryGrid = document.querySelector('.gallery-grid');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadGalleryImages();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// Load Gallery Images
function loadGalleryImages() {
    if (!galleryGrid) return;
    
    // Load images from localStorage (uploaded via admin)
    const images = JSON.parse(localStorage.getItem('catImages') || '[]');
    
    // Clear existing gallery items except the first one (cat1.jpg)
    const existingItems = galleryGrid.querySelectorAll('.gallery-item');
    
    // Add uploaded images
    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${image.src}" alt="${image.caption}">`;
        galleryGrid.appendChild(galleryItem);
    });
}

// Contact Form Handler
function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactData = {
        id: generateId(),
        name: formData.get('name') || e.target.elements[0].value,
        email: formData.get('email') || e.target.elements[1].value,
        phone: formData.get('phone') || e.target.elements[2].value,
        message: formData.get('message') || e.target.elements[3].value,
        sentAt: new Date().toISOString()
    };
    
    // Save contact message
    saveContactMessage(contactData);
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    
    // Reset form
    contactForm.reset();
}

// Data Management Functions
function saveContactMessage(contactData) {
    let messages = JSON.parse(localStorage.getItem('candychipaws_messages') || '[]');
    messages.push(contactData);
    localStorage.setItem('candychipaws_messages', JSON.stringify(messages));
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .cat-breed-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(255,165,0,0.95), rgba(255,105,180,0.95))';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #ff6b6b, #ffa500, #ff69b4)';
        }
    }
});

// Auto-close mobile menu when scrolling
window.addEventListener('scroll', () => {
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Real-time form validation
document.addEventListener('input', (e) => {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid ? '#28a745' : '#dc3545';
    }
    
    if (e.target.type === 'tel') {
        const isValid = validatePhone(e.target.value);
        e.target.style.borderColor = isValid ? '#28a745' : '#dc3545';
    }
});

// Admin Functions (for business owner)
function getMessages() {
    return JSON.parse(localStorage.getItem('candychipaws_messages') || '[]');
}

function getCatImages() {
    return JSON.parse(localStorage.getItem('catImages') || '[]');
}

// Export data function
function exportData() {
    const data = {
        messages: getMessages(),
        catImages: getCatImages(),
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candychipaws_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Console commands for business owner
console.log(`
🐾 CandyChipaws Admin Commands:
- getMessages() - View contact messages
- getCatImages() - View uploaded cat images
- exportData() - Export all data

Access the admin panel at admin.html to manage cat gallery.
`);
