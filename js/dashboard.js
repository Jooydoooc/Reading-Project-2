// Dashboard Management System
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.questionTypes = [
            {
                id: 'tfng',
                name: 'True/False/Not Given',
                icon: 'fas fa-toggle-on',
                category: 'matching',
                difficulty: 'medium',
                description: 'Identify if information is true, false, or not given'
            },
            {
                id: 'yesnong',
                name: 'Yes/No/Not Given',
                icon: 'fas fa-check-circle',
                category: 'matching',
                difficulty: 'medium',
                description: 'Similar to TFNG but with Yes/No'
            },
            {
                id: 'matching-headings',
                name: 'Matching Headings',
                icon: 'fas fa-heading',
                category: 'matching',
                difficulty: 'high',
                description: 'Match headings to paragraphs'
            },
            {
                id: 'matching-info',
                name: 'Matching Information',
                icon: 'fas fa-info-circle',
                category: 'matching',
                difficulty: 'high',
                description: 'Match information to paragraphs'
            },
            {
                id: 'matching-sentence-ends',
                name: 'Matching Sentence Endings',
                icon: 'fas fa-exchange-alt',
                category: 'matching',
                difficulty: 'medium',
                description: 'Complete sentences by matching endings'
            },
            {
                id: 'matching-authors',
                name: 'Matching Authors',
                icon: 'fas fa-user-edit',
                category: 'matching',
                difficulty: 'low',
                description: 'Match statements to authors'
            },
            {
                id: 'multiple-choice',
                name: 'Multiple Choice',
                icon: 'fas fa-dot-circle',
                category: 'multiple',
                difficulty: 'medium',
                description: 'Choose one correct answer'
            },
            {
                id: 'multiple-two',
                name: 'Multiple Choice (Two Options)',
                icon: 'fas fa-balance-scale',
                category: 'multiple',
                difficulty: 'low',
                description: 'Choose between two options'
            },
            {
                id: 'multiple-three',
                name: 'Multiple Choice (Three Options)',
                icon: 'fas fa-th',
                category: 'multiple',
                difficulty: 'medium',
                description: 'Choose from three options'
            },
            {
                id: 'note-completion',
                name: 'Note Completion',
                icon: 'fas fa-sticky-note',
                category: 'completion',
                difficulty: 'low',
                description: 'Complete notes with words from text'
            },
            {
                id: 'table-completion',
                name: 'Table Completion',
                icon: 'fas fa-table',
                category: 'completion',
                difficulty: 'low',
                description: 'Complete tables with information'
            },
            {
                id: 'sentence-completion',
                name: 'Sentence Completion',
                icon: 'fas fa-comment-alt',
                category: 'completion',
                difficulty: 'medium',
                description: 'Complete sentences with words'
            },
            {
                id: 'summary-completion',
                name: 'Summary Completion',
                icon: 'fas fa-file-contract',
                category: 'completion',
                difficulty: 'medium',
                description: 'Complete summaries of text'
            },
            {
                id: 'flow-chart',
                name: 'Flow Chart Completion',
                icon: 'fas fa-project-diagram',
                category: 'completion',
                difficulty: 'high',
                description: 'Complete flow charts'
            },
            {
                id: 'diagram-labelling',
                name: 'Diagram Labelling',
                icon: 'fas fa-drafting-compass',
                category: 'completion',
                difficulty: 'low',
                description: 'Label diagrams or pictures'
            },
            {
                id: 'short-answers',
                name: 'Short Answer Questions',
                icon: 'fas fa-question',
                category: 'completion',
                difficulty: 'low',
                description: 'Answer questions briefly'
            }
        ];
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.renderQuickQuestionTypes();
        this.loadActivities();
        this.updateConnectionStatus();
        this.setupProgressBars();
    }

    checkAuthentication() {
        const user = sessionStorage.getItem('current_user');
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        try {
            this.currentUser = JSON.parse(user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = 'index.html';
        }
    }

    loadUserData() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userClass').textContent = this.currentUser.class;
            document.getElementById('targetBand').textContent = this.currentUser.targetBand;
            document.getElementById('greetingName').textContent = this.currentUser.name.split(' ')[0];
            
            // Update module badge
            const moduleBadge = document.createElement('span');
            moduleBadge.className = `module-badge ${this.currentUser.module}`;
            moduleBadge.textContent = this.currentUser.module === 'academic' ? 'Academic' : 'General';
            document.querySelector('.user-details').appendChild(moduleBadge);
            
            // Load progress from localStorage
            this.loadProgress();
        }
    }

    loadProgress() {
        const progress = localStorage.getItem(`progress_${this.currentUser.userId}`) || '35';
        document.getElementById('mainProgressBar').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Band ${(5 + (parseInt(progress) / 100 * 4)).toFixed(1)}`;
        
        // Load completed tests
        const completed = localStorage.getItem(`completed_${this.currentUser.userId}`) || '0';
        document.getElementById('completedTests').textContent = completed;
        
        // Update best score
        const bestScore = localStorage.getItem(`best_score_${this.currentUser.userId}`) || '7.0';
        document.getElementById('bestScore').textContent = bestScore;
        
        // Update streak
        const streak = localStorage.getItem(`streak_${this.currentUser.userId}`) || '3';
        document.getElementById('streakDays').textContent = streak;
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Telegram help modal
        const telegramModal = document.getElementById('telegramModal');
        const closeModal = telegramModal.querySelector('.close-modal');
        
        window.openTelegramHelp = () => {
            telegramModal.style.display = 'flex';
        };

        closeModal.addEventListener('click', () => {
            telegramModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === telegramModal) {
                telegramModal.style.display = 'none';
            }
        });

        // Teacher access button
        document.getElementById('teacherAccessBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showTeacherAccessInfo();
        });
    }

    renderQuickQuestionTypes() {
        const container = document.getElementById('quickQuestionTypes');
        const quickTypes = this.questionTypes.slice(0, 8); // Show first 8 types
        
        container.innerHTML = quickTypes.map(type => `
            <div class="question-type-item" onclick="navigateToQuestionType('${type.id}')">
                <div class="type-icon ${type.category}">
                    <i class="${type.icon}"></i>
                </div>
                <div class="type-details">
                    <h4>${type.name}</h4>
                    <p>${type.description}</p>
                </div>
            </div>
        `).join('');
    }

    navigateToQuestionType(typeId) {
        const type = this.questionTypes.find(t => t.id === typeId);
        if (type) {
            // Save selected question type
            sessionStorage.setItem('selected_question_type', JSON.stringify(type));
            // Redirect to question type practice page
            window.location.href = 'question-types.html';
        }
    }

    loadActivities() {
        const activities = JSON.parse(localStorage.getItem(`activities_${this.currentUser.userId}`) || '[]');
        const container = document.getElementById('activityList');
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Start your first practice session</h4>
                        <p>Begin with any of the three practice modes above</p>
                    </div>
                    <div class="activity-time">
                        <span>Just now</span>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">
                    <span>${this.formatTime(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    formatTime(timestamp) {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffMs = now - activityTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return activityTime.toLocaleDateString();
    }

    setupProgressBars() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            const percent = bar.dataset.percent;
            bar.style.height = `${percent}%`;
        });
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        
        const updateStatus = () => {
            if (navigator.onLine) {
                statusElement.innerHTML = '<i class="fas fa-wifi"></i><span>Online</span>';
                statusElement.style.color = '#0e9f6e';
            } else {
                statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Offline</span>';
                statusElement.style.color = '#dc2626';
            }
        };
        
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    }

    handleLogout() {
        // Clear session storage
        sessionStorage.removeItem('current_user');
        
        // Show logout message
        this.showToast('Logged out successfully', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    showTeacherAccessInfo() {
        alert('Teacher Access:\n\nEmail: teacher@ieltsmaster.com\nPassword: Please contact administrator\n\nTelegram Bot Setup required in Vercel environment variables.');
    }

    showToast(message, type = 'info') {
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

// Global functions for HTML onclick handlers
window.startFullTest = function() {
    // Redirect to full test page
    window.location.href = 'full-test.html';
};

window.startPassagePractice = function() {
    // Redirect to passage practice page
    window.location.href = 'passages.html';
};

window.startQuestionTypePractice = function() {
    // Redirect to question type page
    window.location.href = 'question-types.html';
};

window.navigateToQuestionType = function(typeId) {
    window.dashboard.navigateToQuestionType(typeId);
};

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
