// Main Application State
const appState = {
    currentTest: null,
    currentQuestion: 1,
    answers: {},
    flaggedQuestions: new Set(),
    timer: null,
    timeRemaining: 60 * 60, // 60 minutes in seconds
    isTestActive: false,
    studentInfo: {
        name: localStorage.getItem('studentName') || '',
        class: localStorage.getItem('studentClass') || ''
    }
};

// DOM Elements
const elements = {
    testList: document.getElementById('testList'),
    testTitle: document.getElementById('testTitle'),
    timerDisplay: document.getElementById('timerDisplay'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    passageContent: document.getElementById('passageContent'),
    questionsContainer: document.getElementById('questionsContainer'),
    answerGrid: document.getElementById('answerGrid'),
    studentNameInput: document.getElementById('studentNameInput'),
    studentClass: document.getElementById('studentClass'),
    submitTestBtn: document.getElementById('submitTestBtn'),
    saveDraftBtn: document.getElementById('saveDraftBtn'),
    startTestBtn: document.getElementById('startTestBtn'),
    timerBtn: document.getElementById('timerBtn'),
    currentQuestion: document.getElementById('currentQuestion'),
    prevQuestion: document.getElementById('prevQuestion'),
    nextQuestion: document.getElementById('nextQuestion'),
    toggleColumns: document.getElementById('toggleColumns'),
    teacherModal: document.getElementById('teacherModal'),
    teacherLogin: document.getElementById('teacherLogin')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadTests();
    setupEventListeners();
    loadStudentInfo();
    updateConnectionStatus();
});

function initializeApp() {
    // Check if offline capability is supported
    if ('serviceWorker' in navigator) {
        setupServiceWorker();
    }
    
    // Check for pending submissions
    checkPendingSubmissions();
    
    // Update stats from localStorage
    updateStats();
}

function setupServiceWorker() {
    // Service worker is already registered in index.html
    console.log('Service Worker setup complete');
}

function loadTests() {
    // Mock data - in production, this would come from an API or local file
    const tests = [
        { id: 1, title: 'Academic Test 1', type: 'academic', time: 60, questions: 40, completed: true, score: 7.5 },
        { id: 2, title: 'Academic Test 2', type: 'academic', time: 60, questions: 40, completed: true, score: 7.0 },
        { id: 3, title: 'Academic Test 3', type: 'academic', time: 60, questions: 40, completed: false, score: null },
        { id: 4, title: 'General Training Test 1', type: 'general', time: 60, questions: 40, completed: true, score: 8.0 },
        { id: 5, title: 'General Training Test 2', type: 'general', time: 60, questions: 40, completed: false, score: null },
        { id: 6, title: 'Matching Headings Practice', type: 'practice', time: 20, questions: 10, completed: true, score: 8.5 },
        { id: 7, title: 'True/False/Not Given Practice', type: 'practice', time: 20, questions: 10, completed: true, score: 7.0 },
        { id: 8, title: 'Academic Test 4', type: 'academic', time: 60, questions: 40, completed: false, score: null },
    ];

    elements.testList.innerHTML = tests.map(test => `
        <div class="test-item ${test.completed ? 'completed' : ''}" data-id="${test.id}">
            <div class="test-title">${test.title}</div>
            <div class="test-meta">
                <span>${test.type.toUpperCase()}</span>
                <span>${test.time} min</span>
                <span>${test.questions} questions</span>
                ${test.completed ? `<span>Score: ${test.score}</span>` : ''}
            </div>
        </div>
    `).join('');

    // Add click event to test items
    document.querySelectorAll('.test-item').forEach(item => {
        item.addEventListener('click', function() {
            const testId = this.dataset.id;
            loadTest(testId);
        });
    });

    // Load first test by default
    if (tests.length > 0) {
        loadTest(tests[0].id);
    }
}

function loadTest(testId) {
    // In production, this would fetch test data from a local file or API
    appState.currentTest = {
        id: testId,
        title: `IELTS Academic Reading Test ${testId}`,
        type: 'academic',
        time: 60,
        questions: 40
    };

    elements.testTitle.textContent = appState.currentTest.title;
    
    // Load passage (mock data)
    loadPassage(testId);
    
    // Load questions (mock data)
    loadQuestions(testId);
    
    // Initialize answer grid
    initializeAnswerGrid();
    
    // Load saved answers if any
    loadSavedAnswers(testId);
}

function loadPassage(testId) {
    // Mock passage - in production, this would be loaded from a file
    const passages = {
        1: `<h4>The Rise of Vertical Farming</h4>
            <p><strong>A</strong> As the global population continues to climb toward 10 billion, traditional agriculture is struggling to keep up...</p>
            <p><strong>B</strong> The concept isn't entirely new. The Hanging Gardens of Babylon, one of the Seven Wonders of the Ancient World...</p>
            <p><strong>C</strong> One of the most significant advantages of vertical farming is its water efficiency...</p>`,
        2: `<h4>The History of Coffee</h4>
            <p><strong>A</strong> The story of coffee begins in the Ethiopian highlands...</p>
            <p><strong>B</strong> From Ethiopia, coffee spread to the Arabian Peninsula...</p>`,
        3: `<h4>Climate Change and Coral Reefs</h4>
            <p><strong>A</strong> Coral reefs, often called the "rainforests of the sea," are among the most diverse ecosystems on Earth...</p>`
    };

    elements.passageContent.innerHTML = `
        <p>You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage below.</p>
        ${passages[testId] || passages[1]}
    `;
}

function loadQuestions(testId) {
    // Mock questions - in production, load from JSON file
    const questions = [];
    const questionTypes = ['Multiple Choice', 'True/False/Not Given', 'Matching Headings', 'Sentence Completion'];
    
    for (let i = 1; i <= 13; i++) {
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        questions.push({
            id: i,
            text: `Question ${i}: What is the main idea of paragraph ${String.fromCharCode(64 + (i % 3 + 1))}?`,
            type: type,
            options: type === 'Multiple Choice' 
                ? ['Option A', 'Option B', 'Option C', 'Option D']
                : type === 'True/False/Not Given'
                ? ['True', 'False', 'Not Given']
                : ['Heading i', 'Heading ii', 'Heading iii', 'Heading iv']
        });
    }
    
    elements.questionsContainer.innerHTML = questions.map((q, index) => `
        <div class="question-block ${index === 0 ? 'active' : ''}" data-question="${q.id}">
            <p class="question-text">${q.text}</p>
            <div class="options">
                ${q.options.map((opt, optIndex) => `
                    <label class="option">
                        <input type="radio" name="q${q.id}" value="${String.fromCharCode(65 + optIndex)}">
                        <span class="option-text">${opt}</span>
                    </label>
                `).join('')}
            </div>
            <div class="question-actions">
                <button class="flag-btn" data-question="${q.id}" onclick="toggleFlag(${q.id})">
                    <i class="${appState.flaggedQuestions.has(q.id) ? 'fas' : 'far'} fa-flag"></i> 
                    ${appState.flaggedQuestions.has(q.id) ? 'Remove flag' : 'Flag for review'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Update question navigation
    updateQuestionNavigation();
}

function initializeAnswerGrid() {
    elements.answerGrid.innerHTML = '';
    
    for (let i = 1; i <= 40; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'answer-bubble';
        bubble.textContent = i;
        bubble.dataset.question = i;
        
        bubble.addEventListener('click', () => {
            navigateToQuestion(i);
        });
        
        elements.answerGrid.appendChild(bubble);
    }
}

function setupEventListeners() {
    // Start test button
    elements.startTestBtn.addEventListener('click', startTest);
    
    // Timer button
    elements.timerBtn.addEventListener('click', toggleTimer);
    
    // Question navigation
    elements.prevQuestion.addEventListener('click', () => navigateToQuestion(appState.currentQuestion - 1));
    elements.nextQuestion.addEventListener('click', () => navigateToQuestion(appState.currentQuestion + 1));
    
    // Column toggle
    elements.toggleColumns.addEventListener('click', () => {
        elements.passageContent.classList.toggle('two-columns');
    });
    
    // Answer selection
    elements.questionsContainer.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const questionNum = parseInt(e.target.name.replace('q', ''));
            const answer = e.target.value;
            
            appState.answers[questionNum] = answer;
            updateAnswerBubble(questionNum, answer);
            saveAnswersLocally();
        }
    });
    
    // Student info input
    elements.studentNameInput.addEventListener('input', (e) => {
        appState.studentInfo.name = e.target.value;
        localStorage.setItem('studentName', e.target.value);
    });
    
    elements.studentClass.addEventListener('input', (e) => {
        appState.studentInfo.class = e.target.value;
        localStorage.setItem('studentClass', e.target.value);
    });
    
    // Save draft button
    elements.saveDraftBtn.addEventListener('click', saveDraft);
    
    // Submit test button
    elements.submitTestBtn.addEventListener('click', submitTest);
    
    // Teacher login
    elements.teacherLogin.addEventListener('click', () => {
        elements.teacherModal.classList.remove('hidden');
    });
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        elements.teacherModal.classList.add('hidden');
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTests(this.dataset.type);
        });
    });
}

function startTest() {
    if (!appState.isTestActive) {
        appState.isTestActive = true;
        appState.timeRemaining = 60 * 60;
        elements.startTestBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Test';
        elements.startTestBtn.classList.add('btn-warning');
        
        startTimer();
        
        // Show first question
        navigateToQuestion(1);
        
        // Disable test selection during test
        document.querySelectorAll('.test-item').forEach(item => {
            item.style.pointerEvents = 'none';
            item.style.opacity = '0.7';
        });
    } else {
        pauseTest();
    }
}

function pauseTest() {
    appState.isTestActive = false;
    clearInterval(appState.timer);
    elements.startTestBtn.innerHTML = '<i class="fas fa-play"></i> Resume Test';
    elements.startTestBtn.classList.remove('btn-warning');
}

function startTimer() {
    clearInterval(appState.timer);
    
    appState.timer = setInterval(() => {
        if (appState.timeRemaining <= 0) {
            clearInterval(appState.timer);
            timeUp();
            return;
        }
        
        appState.timeRemaining--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(appState.timeRemaining / 60);
    const seconds = appState.timeRemaining % 60;
    elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running low
    if (appState.timeRemaining < 300) { // 5 minutes
        elements.timerDisplay.style.color = 'var(--primary-red)';
    } else if (appState.timeRemaining < 600) { // 10 minutes
        elements.timerDisplay.style.color = 'var(--primary-yellow)';
    }
}

function toggleTimer() {
    if (appState.timer) {
        clearInterval(appState.timer);
        appState.timer = null;
        elements.timerBtn.innerHTML = '<i class="fas fa-play"></i> Start Timer';
    } else {
        startTimer();
        elements.timerBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Timer';
    }
}

function navigateToQuestion(questionNum) {
    if (questionNum < 1 || questionNum > 13) return;
    
    // Hide current question
    document.querySelector(`.question-block[data-question="${appState.currentQuestion}"]`)?.classList.remove('active');
    
    // Show new question
    appState.currentQuestion = questionNum;
    document.querySelector(`.question-block[data-question="${questionNum}"]`)?.classList.add('active');
    
    // Update navigation display
    elements.currentQuestion.textContent = `Question ${questionNum} of 13`;
    
    // Update answer bubble highlight
    updateAnswerBubbleHighlight();
}

function toggleFlag(questionNum) {
    if (appState.flaggedQuestions.has(questionNum)) {
        appState.flaggedQuestions.delete(questionNum);
    } else {
        appState.flaggedQuestions.add(questionNum);
    }
    
    // Update flag button
    const flagBtn = document.querySelector(`.flag-btn[data-question="${questionNum}"]`);
    if (flagBtn) {
        flagBtn.innerHTML = `<i class="${appState.flaggedQuestions.has(questionNum) ? 'fas' : 'far'} fa-flag"></i> 
                            ${appState.flaggedQuestions.has(questionNum) ? 'Remove flag' : 'Flag for review'}`;
    }
    
    // Update answer bubble
    const bubble = document.querySelector(`.answer-bubble[data-question="${questionNum}"]`);
    if (bubble) {
        bubble.classList.toggle('flagged', appState.flaggedQuestions.has(questionNum));
    }
    
    saveAnswersLocally();
}

function updateAnswerBubble(questionNum, answer) {
    const bubble = document.querySelector(`.answer-bubble[data-question="${questionNum}"]`);
    if (bubble) {
        bubble.classList.add('answered');
        bubble.textContent = answer;
        bubble.title = `Question ${questionNum}: ${answer}`;
    }
}

function updateAnswerBubbleHighlight() {
    document.querySelectorAll('.answer-bubble').forEach(bubble => {
        bubble.classList.remove('current');
        if (parseInt(bubble.dataset.question) === appState.currentQuestion) {
            bubble.classList.add('current');
        }
    });
}

function saveAnswersLocally() {
    const saveData = {
        testId: appState.currentTest?.id,
        answers: appState.answers,
        flaggedQuestions: Array.from(appState.flaggedQuestions),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`ielts_test_${appState.currentTest?.id}`, JSON.stringify(saveData));
    console.log('Answers saved locally');
}

function loadSavedAnswers(testId) {
    const saved = localStorage.getItem(`ielts_test_${testId}`);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appState.answers = data.answers || {};
            appState.flaggedQuestions = new Set(data.flaggedQuestions || []);
            
            // Restore answers in UI
            Object.keys(appState.answers).forEach(qNum => {
                const answer = appState.answers[qNum];
                const radio = document.querySelector(`input[name="q${qNum}"][value="${answer}"]`);
                if (radio) {
                    radio.checked = true;
                    updateAnswerBubble(parseInt(qNum), answer);
                }
            });
            
            // Restore flags
            appState.flaggedQuestions.forEach(qNum => {
                toggleFlag(qNum);
            });
            
            console.log('Saved answers loaded');
        } catch (error) {
            console.error('Error loading saved answers:', error);
        }
    }
}

async function submitTest() {
    // Validate student info
    if (!appState.studentInfo.name || !appState.studentInfo.class) {
        alert('Please enter your name and class before submitting.');
        return;
    }
    
    // Prepare submission data
    const submission = {
        studentName: appState.studentInfo.name,
        studentClass: appState.studentInfo.class,
        testId: appState.currentTest?.id,
        testTitle: appState.currentTest?.title,
        answers: appState.answers,
        flaggedQuestions: Array.from(appState.flaggedQuestions),
        totalQuestions: 13,
        answeredQuestions: Object.keys(appState.answers).length,
        timestamp: new Date().toISOString(),
        timeSpent: 60 * 60 - appState.timeRemaining
    };
    
    // Show loading state
    elements.submitTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    elements.submitTestBtn.disabled = true;
    
    try {
        // Try to submit via API
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Mark test as completed
            markTestAsCompleted(appState.currentTest.id);
            
            // Show success message
            showNotification('Test submitted successfully! Answers sent to Telegram group.', 'success');
            
            // Reset for next test
            resetTest();
            
        } else {
            throw new Error('Server error');
        }
        
    } catch (error) {
        console.log('Offline - saving submission for later sync');
        
        // Save submission locally for later sync
        savePendingSubmission(submission);
        
        // Show offline message
        showNotification('You are offline. Submission saved and will be sent when online.', 'warning');
    } finally {
        // Reset button state
        elements.submitTestBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit to Telegram Group';
        elements.submitTestBtn.disabled = false;
    }
}

function savePendingSubmission(submission) {
    const pending = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    pending.push(submission);
    localStorage.setItem('pendingSubmissions', JSON.stringify(pending));
}

async function syncPendingSubmissions() {
    const pending = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    
    if (pending.length === 0) return;
    
    for (const submission of pending) {
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            
            if (response.ok) {
                // Remove from pending
                const index = pending.indexOf(submission);
                pending.splice(index, 1);
                localStorage.setItem('pendingSubmissions', JSON.stringify(pending));
                
                console.log('Pending submission synced:', submission.testId);
            }
        } catch (error) {
            console.error('Failed to sync submission:', error);
            break; // Stop trying if we're offline again
        }
    }
}

function checkPendingSubmissions() {
    const pending = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
    if (pending.length > 0 && navigator.onLine) {
        syncPendingSubmissions();
    }
}

function markTestAsCompleted(testId) {
    const testItem = document.querySelector(`.test-item[data-id="${testId}"]`);
    if (testItem) {
        testItem.classList.add('completed');
        
        // Update stats
        updateStats();
    }
}

function updateStats() {
    const completedTests = document.querySelectorAll('.test-item.completed').length;
    const totalTests = document.querySelectorAll('.test-item').length;
    const progress = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;
    
    elements.testsCompleted.textContent = completedTests;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressText.textContent = `${completedTests}/${totalTests} Tests Completed`;
    
    // Update band score based on completion
    const baseBand = 5.0;
    const bonusPerTest = 0.15;
    const calculatedBand = Math.min(9.0, baseBand + (completedTests * bonusPerTest));
    document.getElementById('currentBand').textContent = calculatedBand.toFixed(1);
}

function saveDraft() {
    saveAnswersLocally();
    showNotification('Draft saved locally!', 'success');
}

function resetTest() {
    appState.answers = {};
    appState.flaggedQuestions.clear();
    appState.currentQuestion = 1;
    appState.isTestActive = false;
    
    // Clear UI
    document.querySelectorAll('.answer-bubble').forEach(bubble => {
        bubble.classList.remove('answered', 'flagged');
        bubble.textContent = bubble.dataset.question;
    });
    
    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Reset flags
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.innerHTML = '<i class="far fa-flag"></i> Flag for review';
    });
    
    // Navigate to first question
    navigateToQuestion(1);
}

function updateQuestionNavigation() {
    // Implementation depends on your specific navigation requirements
}

function filterTests(type) {
    const testItems = document.querySelectorAll('.test-item');
    
    testItems.forEach(item => {
        const testType = item.querySelector('.test-meta span').textContent.toLowerCase();
        
        switch (type) {
            case 'all':
                item.style.display = 'block';
                break;
            case 'academic':
                item.style.display = testType.includes('academic') ? 'block' : 'none';
                break;
            case 'general':
                item.style.display = testType.includes('general') ? 'block' : 'none';
                break;
            case 'uncompleted':
                item.style.display = item.classList.contains('completed') ? 'none' : 'block';
                break;
        }
    });
}

function loadStudentInfo() {
    if (appState.studentInfo.name) {
        elements.studentNameInput.value = appState.studentInfo.name;
        document.getElementById('studentName').textContent = appState.studentInfo.name;
    }
    if (appState.studentInfo.class) {
        elements.studentClass.value = appState.studentInfo.class;
    }
}

function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    const lastSyncElement = document.getElementById('lastSync');
    
    if (navigator.onLine) {
        statusElement.innerHTML = 'Status: <span class="connected">Online</span>';
        lastSyncElement.textContent = 'Last sync: Just now';
    } else {
        statusElement.innerHTML = 'Status: <span class="disconnected">Offline</span>';
        const lastSync = localStorage.getItem('lastSync') || 'Never';
        lastSyncElement.textContent = `Last sync: ${lastSync}`;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function timeUp() {
    showNotification('Time is up! Test will be automatically submitted.', 'warning');
    
    // Auto-submit if student info is provided
    if (appState.studentInfo.name && appState.studentInfo.class) {
        setTimeout(submitTest, 2000);
    }
}

// Global functions for HTML event handlers
window.toggleFlag = toggleFlag;
window.copyWebhookUrl = function() {
    const webhookUrl = document.getElementById('webhookUrl');
    navigator.clipboard.writeText(webhookUrl.textContent)
        .then(() => showNotification('Webhook URL copied to clipboard!', 'success'))
        .catch(err => console.error('Failed to copy:', err));
};

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification-success {
        background: var(--primary-green);
        border-left: 4px solid #0a7c5a;
    }
    .notification-warning {
        background: var(--primary-yellow);
        color: #78350f;
        border-left: 4px solid #d97706;
    }
    .notification-info {
        background: var(--primary-blue);
        border-left: 4px solid #1e40af;
    }
    .close-notification {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        line-height: 1;
    }
`;
document.head.appendChild(style);
