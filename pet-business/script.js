// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const bookingModal = document.getElementById('bookingModal');
const queueModal = document.getElementById('queueModal');
const successModal = document.getElementById('successModal');
const bookingForm = document.getElementById('bookingForm');
const queueForm = document.getElementById('queueForm');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadStoredData();
    updateQueueDisplay();
    loadGalleryImages();
}

// Load gallery images from admin uploads
function loadGalleryImages() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Get images uploaded by admin
    const adminImages = JSON.parse(localStorage.getItem('catImages') || '[]');
    
    // Clear existing gallery
    galleryGrid.innerHTML = '';
    
    if (adminImages.length === 0) {
        // Show default message if no images uploaded
        galleryGrid.innerHTML = `
            <div class="gallery-item">
                <div class="image-fallback" style="padding: 2rem; text-align: center; color: white;">
                    <i class="fas fa-cat" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No cats available yet</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Check back soon for our beautiful cats!</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Display admin uploaded images
    adminImages.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.caption}" style="width: 100%; height: 300px; object-fit: cover;">
            <div class="gallery-caption" style="padding: 1rem; text-align: center; color: white;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">${image.caption}</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Uploaded: ${new Date(image.uploadedAt).toLocaleDateString()}</p>
            </div>
        `;
        galleryGrid.appendChild(galleryItem);
    });
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Form submissions
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    if (queueForm) {
        queueForm.addEventListener('submit', handleQueueSubmission);
    }
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
    
    // Set minimum date to today for booking
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// Modal Functions
function openBookingModal(serviceType) {
    const serviceName = document.getElementById('serviceName');
    const serviceTypeInput = document.getElementById('serviceType');
    
    if (serviceType === 'appointment') {
        serviceName.value = 'General Appointment';
        serviceTypeInput.value = 'appointment';
    } else {
        serviceName.value = serviceType;
        serviceTypeInput.value = serviceType;
    }
    
    if (bookingModal) {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function openQueueModal() {
    if (queueModal) {
        queueModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset forms when closing
        if (modalId === 'bookingModal' && bookingForm) {
            bookingForm.reset();
        } else if (modalId === 'queueModal' && queueForm) {
            queueForm.reset();
        }
    }
}

function showSuccessModal(message) {
    const successMessage = document.getElementById('successMessage');
    if (successMessage && successModal) {
        successMessage.textContent = message;
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Form Handlers
function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const bookingData = {
        id: generateId(),
        serviceType: document.getElementById('serviceType').value,
        serviceName: document.getElementById('serviceName').value,
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value,
        additionalNotes: document.getElementById('additionalNotes').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Validate business hours
    if (!isValidBusinessTime(bookingData.preferredTime)) {
        alert('Please select a time between 10:00 AM and 8:00 PM');
        return;
    }
    
    // Save booking
    saveBooking(bookingData);
    
    // Show success message
    closeModal('bookingModal');
    showSuccessModal(`Booking confirmed for ${bookingData.serviceName} on ${formatDate(bookingData.preferredDate)} at ${formatTime(bookingData.preferredTime)}. We'll contact you soon!`);
    
    // Send confirmation (simulate)
    sendBookingConfirmation(bookingData);
}

function handleQueueSubmission(e) {
    e.preventDefault();
    
    const queueData = {
        id: generateId(),
        customerName: document.getElementById('queueName').value,
        customerPhone: document.getElementById('queuePhone').value,
        serviceInterested: document.getElementById('queueService').value,
        additionalNotes: document.getElementById('queueNotes').value,
        position: getNextQueuePosition(),
        status: 'waiting',
        joinedAt: new Date().toISOString()
    };
    
    // Save to queue
    saveToQueue(queueData);
    
    // Show success message
    closeModal('queueModal');
    showSuccessModal(`You've been added to our queue! Your position is #${queueData.position}. We'll contact you at ${queueData.customerPhone} when it's your turn.`);
    
    // Update queue display
    updateQueueDisplay();
}

function handleContactSubmission(e) {
    e.preventDefault();
    
    const customerName = e.target.elements[0].value;
    const customerEmail = e.target.elements[1].value;
    const customerPhone = e.target.elements[2].value;
    const customerMessage = e.target.elements[3].value;
    
    // Show contact options modal
    showContactOptionsModal(customerName, customerMessage);
    
    // Reset form
    contactForm.reset();
}

// Show contact options modal
function showContactOptionsModal(customerName, customerMessage) {
    // Escape quotes in the parameters to prevent JavaScript errors
    const escapedName = customerName.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const escapedMessage = customerMessage.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    const modalHTML = `
        <div id="contactOptionsModal" class="modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div class="modal-content" style="background-color: #fefefe; margin: 10% auto; padding: 30px; border-radius: 20px; width: 90%; max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h2 style="color: #333; margin-bottom: 20px; font-size: 1.8rem;">Choose Your Preferred Contact Method</h2>
                <p style="color: #666; margin-bottom: 30px; font-size: 1.1rem;">We'd love to hear from you! Please choose how you'd like to contact us:</p>
                
                <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">
                    <button onclick="contactViaWhatsApp('${escapedName}', '${escapedMessage}')" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 20px; font-size: 1.1rem;">
                        <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i>
                        Contact via WhatsApp
                    </button>
                    
                    <button onclick="contactViaInstagram()" class="btn btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 20px; font-size: 1.1rem;">
                        <i class="fab fa-instagram" style="font-size: 1.3rem;"></i>
                        Contact via Instagram
                    </button>
                    
                    <button onclick="contactViaPhone()" class="btn" style="background: linear-gradient(45deg, #28a745, #20c997); color: white; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 20px; font-size: 1.1rem;">
                        <i class="fas fa-phone" style="font-size: 1.3rem;"></i>
                        Call Us Directly
                    </button>
                </div>
                
                <button onclick="closeContactOptionsModal()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 1rem;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

// Contact via WhatsApp
function contactViaWhatsApp(customerName, customerMessage) {
    const phoneNumbers = ['+919693427712', '+918092881183', '+918578901229'];
    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
    const whatsappMessage = `Hi! I'm ${customerName}. ${customerMessage ? customerMessage : 'I\'m interested in your pet breeding services. Please let me know more details.'}`;
    const whatsappURL = `https://wa.me/${randomPhone.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappURL, '_blank');
    closeContactOptionsModal();
}

// Contact via Instagram
function contactViaInstagram() {
    const instagramURL = 'https://www.instagram.com/candychipaws?igsh=N2RsZ2VhcGIzNWN3';
    window.open(instagramURL, '_blank');
    closeContactOptionsModal();
}

// Contact via Phone
function contactViaPhone() {
    const phoneNumbers = ['+91 9693427712', '+91 8092881183', '+91 8578901229'];
    const phoneList = phoneNumbers.join('\n');
    
    alert(`Please call us at any of these numbers:\n\n${phoneList}\n\nBusiness Hours: 10:00 AM - 8:00 PM Daily`);
    closeContactOptionsModal();
}

// Close contact options modal
function closeContactOptionsModal() {
    const modal = document.getElementById('contactOptionsModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Data Management Functions
function saveBooking(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('candychipaws_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('candychipaws_bookings', JSON.stringify(bookings));
}

function saveToQueue(queueData) {
    let queue = JSON.parse(localStorage.getItem('candychipaws_queue') || '[]');
    queue.push(queueData);
    localStorage.setItem('candychipaws_queue', JSON.stringify(queue));
}

function saveContactMessage(contactData) {
    let messages = JSON.parse(localStorage.getItem('candychipaws_messages') || '[]');
    messages.push(contactData);
    localStorage.setItem('candychipaws_messages', JSON.stringify(messages));
}

function loadStoredData() {
    // Load and display any stored data if needed
    const bookings = JSON.parse(localStorage.getItem('candychipaws_bookings') || '[]');
    const queue = JSON.parse(localStorage.getItem('candychipaws_queue') || '[]');
    const messages = JSON.parse(localStorage.getItem('candychipaws_messages') || '[]');
    
    console.log('Loaded data:', { bookings: bookings.length, queue: queue.length, messages: messages.length });
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getNextQueuePosition() {
    const queue = JSON.parse(localStorage.getItem('candychipaws_queue') || '[]');
    const activeQueue = queue.filter(item => item.status === 'waiting');
    return activeQueue.length + 1;
}

function isValidBusinessTime(time) {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 10 && hour <= 19; // 10 AM to 7 PM (last appointment at 7 PM)
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function updateQueueDisplay() {
    const queue = JSON.parse(localStorage.getItem('candychipaws_queue') || '[]');
    const activeQueue = queue.filter(item => item.status === 'waiting');
    
    // Update queue counter if element exists
    const queueCounter = document.getElementById('queueCounter');
    if (queueCounter) {
        queueCounter.textContent = activeQueue.length;
    }
}

function sendBookingConfirmation(bookingData) {
    // Simulate sending confirmation
    console.log('Booking confirmation sent:', bookingData);
    
    // In a real application, you would send this data to your backend
    // fetch('/api/bookings', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(bookingData)
    // });
}

// Admin Functions (for business owner)
function getBookings() {
    return JSON.parse(localStorage.getItem('candychipaws_bookings') || '[]');
}

function getQueue() {
    return JSON.parse(localStorage.getItem('candychipaws_queue') || '[]');
}

function getMessages() {
    return JSON.parse(localStorage.getItem('candychipaws_messages') || '[]');
}

function updateBookingStatus(bookingId, status) {
    let bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = status;
        bookings[bookingIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('candychipaws_bookings', JSON.stringify(bookings));
    }
}

function updateQueueStatus(queueId, status) {
    let queue = getQueue();
    const queueIndex = queue.findIndex(q => q.id === queueId);
    if (queueIndex !== -1) {
        queue[queueIndex].status = status;
        queue[queueIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('candychipaws_queue', JSON.stringify(queue));
        updateQueueDisplay();
    }
}

// Analytics Functions
function getBookingStats() {
    const bookings = getBookings();
    const queue = getQueue();
    const messages = getMessages();
    
    return {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        queueLength: queue.filter(q => q.status === 'waiting').length,
        totalMessages: messages.length,
        popularServices: getPopularServices(bookings),
        recentActivity: getRecentActivity()
    };
}

function getPopularServices(bookings) {
    const serviceCounts = {};
    bookings.forEach(booking => {
        serviceCounts[booking.serviceName] = (serviceCounts[booking.serviceName] || 0) + 1;
    });
    
    return Object.entries(serviceCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
}

function getRecentActivity() {
    const bookings = getBookings();
    const queue = getQueue();
    const messages = getMessages();
    
    const allActivity = [
        ...bookings.map(b => ({ type: 'booking', data: b, date: b.createdAt })),
        ...queue.map(q => ({ type: 'queue', data: q, date: q.joinedAt })),
        ...messages.map(m => ({ type: 'message', data: m, date: m.sentAt }))
    ];
    
    return allActivity
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
}

// Export functions for admin panel (if needed)
function exportData() {
    const data = {
        bookings: getBookings(),
        queue: getQueue(),
        messages: getMessages(),
        stats: getBookingStats(),
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
- getBookings() - View all bookings
- getQueue() - View current queue
- getMessages() - View contact messages
- getBookingStats() - View statistics
- exportData() - Export all data
- updateBookingStatus(id, status) - Update booking status
- updateQueueStatus(id, status) - Update queue status

Example: updateBookingStatus('booking123', 'confirmed')
`);

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
    const animateElements = document.querySelectorAll('.service-card, .product-card, .booking-card, .contact-item');
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

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
