// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const uploadForm = document.getElementById('uploadForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLoginSection = document.getElementById('admin-login');
    const adminDashboardSection = document.getElementById('admin-dashboard');
    const adminGallery = document.getElementById('adminGallery');
    
    // Check if user is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
        loadGalleryImages();
    }
    
    // Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (in a real application, this would be done server-side)
        if (username === 'admin' && password === 'Sufiyan786') {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            loadGalleryImages();
        } else {
            alert('Invalid username or password!');
        }
    });
    
    // Upload Form Submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const imageFile = document.getElementById('imageFile').files[0];
        const imageCaption = document.getElementById('imageCaption').value;
        
        if (imageFile) {
            // In a real application, you would upload the file to a server
            // For this demo, we'll just store it in localStorage as base64
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    id: Date.now(),
                    src: e.target.result,
                    caption: imageCaption || 'Beautiful Cat',
                    uploadedAt: new Date().toISOString()
                };
                
                // Save to localStorage
                let images = JSON.parse(localStorage.getItem('catImages') || '[]');
                images.push(imageData);
                localStorage.setItem('catImages', JSON.stringify(images));
                
                // Reset form
                uploadForm.reset();
                
                // Reload gallery
                loadGalleryImages();
                
                // Refresh main website gallery if it exists
                if (window.opener && window.opener.loadGalleryImages) {
                    window.opener.loadGalleryImages();
                }
                
                alert('Image uploaded successfully!');
            };
            reader.readAsDataURL(imageFile);
        }
    });
    
    // Logout Button
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        showLogin();
    });
    
    // Helper Functions
    function showDashboard() {
        adminLoginSection.style.display = 'none';
        adminDashboardSection.style.display = 'block';
    }
    
    function showLogin() {
        adminLoginSection.style.display = 'block';
        adminDashboardSection.style.display = 'none';
    }
    
    function loadGalleryImages() {
        adminGallery.innerHTML = '';
        const images = JSON.parse(localStorage.getItem('catImages') || '[]');
        
        if (images.length === 0) {
            adminGallery.innerHTML = '<p>No images uploaded yet.</p>';
            return;
        }
        
        images.forEach(image => {
            const imageElement = document.createElement('div');
            imageElement.className = 'admin-gallery-item';
            imageElement.innerHTML = `
                <img src="${image.src}" alt="${image.caption}">
                <div class="admin-gallery-item-info">
                    <p>${image.caption}</p>
                    <button class="btn btn-danger" onclick="deleteImage(${image.id})">Delete</button>
                </div>
            `;
            adminGallery.appendChild(imageElement);
        });
    }
    
    // Make deleteImage function available globally
    window.deleteImage = function(imageId) {
        if (confirm('Are you sure you want to delete this image?')) {
            let images = JSON.parse(localStorage.getItem('catImages') || '[]');
            images = images.filter(image => image.id !== imageId);
            localStorage.setItem('catImages', JSON.stringify(images));
            loadGalleryImages();
        }
    };
});
