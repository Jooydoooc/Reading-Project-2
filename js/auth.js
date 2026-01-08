// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadSavedUser();
        this.setupEventListeners();
        this.checkOfflineStatus();
    }

    loadSavedUser() {
        const savedUser = localStorage.getItem('ielts_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.populateForm();
            } catch (error) {
                console.error('Error loading saved user:', error);
            }
        }
    }

    populateForm() {
        if (this.currentUser) {
            document.getElementById('studentName').value = this.currentUser.name || '';
            document.getElementById('studentClass').value = this.currentUser.class || '';
            document.getElementById('targetBand').value = this.currentUser.targetBand || '7.0';
            document.getElementById('moduleType').value = this.currentUser.module || 'academic';
            
            // Update band selector
            document.querySelectorAll('.band-option').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.band === this.currentUser.targetBand) {
                    btn.classList.add('active');
                }
            });
            
            // Update module selector
            document.querySelectorAll('.module-option').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.module === this.currentUser.module) {
                    btn.classList.add('active');
                }
            });
            
            // Update remember me checkbox
            document.getElementById('remember').checked = true;
        }
    }

    setupEventListeners() {
        // Band selector
        document.querySelectorAll('.band-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.band-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('targetBand').value = btn.dataset.band;
            });
        });

        // Module selector
        document.querySelectorAll('.module-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.module-option').forEach(m => m.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('moduleType').value = btn.dataset.module;
            });
        });

        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Guest login
        document.getElementById('guestLogin').addEventListener('click', () => {
            this.handleGuestLogin();
        });

        // Teacher login
        document.getElementById('teacherLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showTeacherModal();
        });

        // Teacher modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideTeacherModal();
        });

        // Teacher login form
        document.getElementById('teacherLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTeacherLogin();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('teacherModal');
            if (e.target === modal) {
                this.hideTeacherModal();
            }
        });
    }

    handleLogin() {
        const userData = {
            name: document.getElementById('studentName').value.trim(),
            class: document.getElementById('studentClass').value.trim(),
            targetBand: document.getElementById('targetBand').value,
            module: document.getElementById('moduleType').value,
            timestamp: new Date().toISOString(),
            userId: this.generateUserId(),
            isGuest: false
        };

        if (!userData.name || !userData.class) {
            this.showToast('Please enter your name and class', 'error');
            return;
        }

        // Save to localStorage if remember me is checked
        if (document.getElementById('remember').checked) {
            localStorage.setItem('ielts_user', JSON.stringify(userData));
        }

        this.currentUser = userData;
        this.redirectToDashboard();
    }

    handleGuestLogin() {
        const guestUser = {
            name: 'Guest Student',
            class: 'Guest Class',
            targetBand: '7.0',
            module: 'academic',
            timestamp: new Date().toISOString(),
            userId: 'guest_' + Date.now(),
            isGuest: true
        };

        this.currentUser = guestUser;
        this.redirectToDashboard();
    }

    handleTeacherLogin() {
        const email = document.getElementById('teacherEmail').value;
        const password = document.getElementById('teacherPassword').value;

        // In production, this would validate against a database
        if (email && password) {
            // For demo purposes, accept any non-empty credentials
            localStorage.setItem('ielts_teacher', JSON.stringify({
                email: email,
                lastLogin: new Date().toISOString()
            }));

            // Redirect to teacher dashboard (would be a separate page in production)
            window.location.href = 'teacher-dashboard.html';
        } else {
            this.showToast('Please enter teacher credentials', 'error');
        }
    }

    showTeacherModal() {
        document.getElementById('teacherModal').classList.add('active');
    }

    hideTeacherModal() {
        document.getElementById('teacherModal').classList.remove('active');
    }

    redirectToDashboard() {
        // Save user to session
        sessionStorage.setItem('current_user', JSON.stringify(this.currentUser));
        
        // Show loading animation
        this.showToast(`Welcome ${this.currentUser.name}! Redirecting...`, 'success');
        
        // Redirect after a brief delay
        setTimeout(() => {
            window.location.href = 'main-menu.html';
        }, 1500);
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    checkOfflineStatus() {
        if (!navigator.onLine) {
            this.showToast('You are offline. Some features may be limited.', 'warning');
        }

        window.addEventListener('online', () => {
            this.showToast('You are back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.showToast('You are offline. Working in offline mode.', 'warning');
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 10px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .toast.show {
        transform: translateX(0);
    }
    .toast-success {
        background: linear-gradient(135deg, #0e9f6e, #0a7c5a);
        border-left: 4px solid #065f46;
    }
    .toast-error {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        border-left: 4px solid #991b1b;
    }
    .toast-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border-left: 4px solid #92400e;
    }
    .toast-info {
        background: linear-gradient(135deg, #1a56db, #1e40af);
        border-left: 4px solid #1e3a8a;
    }
    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
`;
document.head.appendChild(toastStyles);

// Initialize authentication system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
