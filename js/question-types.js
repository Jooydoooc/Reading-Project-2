// Question Types Management
class QuestionTypes {
    constructor() {
        this.types = [
            {
                id: 'tfng',
                name: 'True/False/Not Given',
                icon: 'fas fa-toggle-on',
                category: 'matching',
                difficulty: 'medium',
                description: 'Identify if information is true, false, or not given in the text',
                strategy: `
                    <h4>True/False/Not Given Strategy</h4>
                    <div class="strategy-steps">
                        <div class="step">
                            <h5>Step 1: Understand the Difference</h5>
                            <ul>
                                <li><strong>TRUE:</strong> The statement agrees with the information in the text</li>
                                <li><strong>FALSE:</strong> The statement contradicts the information in the text</li>
                                <li><strong>NOT GIVEN:</strong> There is no information about this in the text</li>
                            </ul>
                        </div>
                        
                        <div class="step">
                            <h5>Step 2: Look for Synonyms</h5>
                            <p>The statement will use different words from the text. Look for:</p>
                            <ul>
                                <li>Synonyms (big = large, small = tiny)</li>
                                <li>Paraphrases (improved significantly = dramatic improvement)</li>
                                <li>Different grammatical structures</li>
                            </ul>
                        </div>
                        
                        <div class="step">
                            <h5>Step 3: Check for Contradictions</h5>
                            <p>For FALSE answers, the text will directly contradict the statement:</p>
                            <ul>
                                <li>Text says "increased," statement says "decreased"</li>
                                <li>Text says "most," statement says "few"</li>
                                <li>Text says "always," statement says "sometimes"</li>
                            </ul>
                        </div>
                        
                        <div class="step">
                            <h5>Common Traps to Avoid</h5>
                            <ul>
                                <li>Don't use your own knowledge - only use information from the text</li>
                                <li>NOT GIVEN doesn't mean "not mentioned at all" - it might be mentioned but not the specific detail</li>
                                <li>Pay attention to qualifiers: some, many, most, all, always, never</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="practice-example">
                        <h5>Example Question:</h5>
                        <p><strong>Statement:</strong> The study found that most students prefer online learning.</p>
                        <p><strong>Text:</strong> "A significant number of students reported enjoying online classes."</p>
                        <p><strong>Answer:</strong> NOT GIVEN (The text says "a significant number" but doesn't specify if it's "most")</p>
                    </div>
                `,
                stats: {
                    questions: 120,
                    avgTime: '1.2 min',
                    successRate: '65%'
                }
            },
            {
                id: 'yesnong',
                name: 'Yes/No/Not Given',
                icon: 'fas fa-check-circle',
                category: 'matching',
                difficulty: 'medium',
                description: 'Similar to TFNG but about opinions/views rather than facts',
                strategy: 'Strategy guide for Yes/No/Not Given...',
                stats: {
                    questions: 100,
                    avgTime: '1.3 min',
                    successRate: '68%'
                }
            },
            {
                id: 'matching-headings',
                name: 'Matching Headings',
                icon: 'fas fa-heading',
                category: 'matching',
                difficulty: 'high',
                description: 'Match headings to paragraphs or sections',
                strategy: 'Strategy guide for Matching Headings...',
                stats: {
                    questions: 80,
                    avgTime: '1.8 min',
                    successRate: '45%'
                }
            },
            {
                id: 'matching-info',
                name: 'Matching Information',
                icon: 'fas fa-info-circle',
                category: 'matching',
                difficulty: 'high',
                description: 'Match information to paragraphs',
                strategy: 'Strategy guide for Matching Information...',
                stats: {
                    questions: 90,
                    avgTime: '1.5 min',
                    successRate: '52%'
                }
            },
            {
                id: 'matching-sentence-ends',
                name: 'Matching Sentence Endings',
                icon: 'fas fa-exchange-alt',
                category: 'matching',
                difficulty: 'medium',
                description: 'Complete sentences by matching endings',
                strategy: 'Strategy guide for Matching Sentence Endings...',
                stats: {
                    questions: 110,
                    avgTime: '1.1 min',
                    successRate: '72%'
                }
            },
            {
                id: 'matching-authors',
                name: 'Matching Authors',
                icon: 'fas fa-user-edit',
                category: 'matching',
                difficulty: 'low',
                description: 'Match statements to authors',
                strategy: 'Strategy guide for Matching Authors...',
                stats: {
                    questions: 60,
                    avgTime: '1.0 min',
                    successRate: '85%'
                }
            },
            {
                id: 'multiple-choice',
                name: 'Multiple Choice',
                icon: 'fas fa-dot-circle',
                category: 'multiple',
                difficulty: 'medium',
                description: 'Choose one correct answer from options',
                strategy: 'Strategy guide for Multiple Choice...',
                stats: {
                    questions: 150,
                    avgTime: '1.4 min',
                    successRate: '70%'
                }
            },
            {
                id: 'multiple-two',
                name: 'Multiple Choice (Two Options)',
                icon: 'fas fa-balance-scale',
                category: 'multiple',
                difficulty: 'low',
                description: 'Choose between two options',
                strategy: 'Strategy guide for Multiple Choice (Two Options)...',
                stats: {
                    questions: 70,
                    avgTime: '0.8 min',
                    successRate: '88%'
                }
            },
            {
                id: 'multiple-three',
                name: 'Multiple Choice (Three Options)',
                icon: 'fas fa-th',
                category: 'multiple',
                difficulty: 'medium',
                description: 'Choose from three options',
                strategy: 'Strategy guide for Multiple Choice (Three Options)...',
                stats: {
                    questions: 95,
                    avgTime: '1.2 min',
                    successRate: '75%'
                }
            },
            {
                id: 'note-completion',
                name: 'Note Completion',
                icon: 'fas fa-sticky-note',
                category: 'completion',
                difficulty: 'low',
                description: 'Complete notes with words from text',
                strategy: 'Strategy guide for Note Completion...',
                stats: {
                    questions: 130,
                    avgTime: '0.9 min',
                    successRate: '82%'
                }
            },
            {
                id: 'table-completion',
                name: 'Table Completion',
                icon: 'fas fa-table',
                category: 'completion',
                difficulty: 'low',
                description: 'Complete tables with information',
                strategy: 'Strategy guide for Table Completion...',
                stats: {
                    questions: 85,
                    avgTime: '1.0 min',
                    successRate: '80%'
                }
            },
            {
                id: 'sentence-completion',
                name: 'Sentence Completion',
                icon: 'fas fa-comment-alt',
                category: 'completion',
                difficulty: 'medium',
                description: 'Complete sentences with words',
                strategy: 'Strategy guide for Sentence Completion...',
                stats: {
                    questions: 140,
                    avgTime: '1.1 min',
                    successRate: '78%'
                }
            },
            {
                id: 'summary-completion',
                name: 'Summary Completion',
                icon: 'fas fa-file-contract',
                category: 'completion',
                difficulty: 'medium',
                description: 'Complete summaries of text',
                strategy: 'Strategy guide for Summary Completion...',
                stats: {
                    questions: 125,
                    avgTime: '1.3 min',
                    successRate: '73%'
                }
            },
            {
                id: 'flow-chart',
                name: 'Flow Chart Completion',
                icon: 'fas fa-project-diagram',
                category: 'completion',
                difficulty: 'high',
                description: 'Complete flow charts',
                strategy: 'Strategy guide for Flow Chart Completion...',
                stats: {
                    questions: 75,
                    avgTime: '1.6 min',
                    successRate: '58%'
                }
            },
            {
                id: 'diagram-labelling',
                name: 'Diagram Labelling',
                icon: 'fas fa-drafting-compass',
                category: 'completion',
                difficulty: 'low',
                description: 'Label diagrams or pictures',
                strategy: 'Strategy guide for Diagram Labelling...',
                stats: {
                    questions: 65,
                    avgTime: '0.7 min',
                    successRate: '90%'
                }
            },
            {
                id: 'short-answers',
                name: 'Short Answer Questions',
                icon: 'fas fa-question',
                category: 'completion',
                difficulty: 'low',
                description: 'Answer questions briefly',
                strategy: 'Strategy guide for Short Answer Questions...',
                stats: {
                    questions: 110,
                    avgTime: '0.8 min',
                    successRate: '85%'
                }
            }
        ];
        
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderQuestionTypes();
        this.setupEventListeners();
        this.loadUserProgress();
    }

    renderQuestionTypes() {
        const container = document.getElementById('questionTypesList');
        const filteredTypes = this.getFilteredTypes();
        
        container.innerHTML = filteredTypes.map(type => `
            <div class="type-card" data-type="${type.id}" data-category="${type.category}" data-difficulty="${type.difficulty}">
                <div class="type-header">
                    <div class="type-icon ${type.category}">
                        <i class="${type.icon}"></i>
                    </div>
                    <div class="type-title">
                        <h4>${type.name}</h4>
                        <span class="difficulty ${type.difficulty}">
                            ${type.difficulty.charAt(0).toUpperCase() + type.difficulty.slice(1)} Difficulty
                        </span>
                    </div>
                </div>
                
                <p class="type-description">${type.description}</p>
                
                <div class="type-stats">
                    <div class="stat">
                        <i class="fas fa-question"></i>
                        <span>${type.stats.questions} questions</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span>${type.stats.avgTime} avg</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-chart-line"></i>
                        <span>${type.stats.successRate} success</span>
                    </div>
                </div>
                
                <div class="type-actions">
                    <button class="type-btn practice-btn" onclick="startPractice('${type.id}')">
                        <i class="fas fa-play-circle"></i>
                        Start Practice
                    </button>
                    <button class="type-btn strategy-btn" onclick="showStrategy('${type.id}')">
                        <i class="fas fa-lightbulb"></i>
                        View Strategy
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredTypes() {
        if (this.currentFilter === 'all') {
            return this.types;
        }
        
        return this.types.filter(type => {
            if (this.currentFilter === 'matching' && type.category === 'matching') return true;
            if (this.currentFilter === 'multiple' && type.category === 'multiple') return true;
            if (this.currentFilter === 'completion' && type.category === 'completion') return true;
            if (this.currentFilter === 'difficulty-high' && type.difficulty === 'high') return true;
            if (this.currentFilter === 'difficulty-medium' && type.difficulty === 'medium') return true;
            if (this.currentFilter === 'difficulty-low' && type.difficulty === 'low') return true;
            return false;
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.category;
                this.renderQuestionTypes();
            });
        });

        // Strategy modal
        const modal = document.getElementById('strategyModal');
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    loadUserProgress() {
        // Load user's progress for each question type from localStorage
        const userId = JSON.parse(sessionStorage.getItem('current_user')).userId;
        
        this.types.forEach(type => {
            const progress = localStorage.getItem(`progress_${userId}_${type.id}`) || '0';
            // Update stats based on user progress
            if (progress > 0) {
                type.stats.successRate = `${Math.min(95, parseInt(type.stats.successRate) + 10)}%`;
            }
        });
    }

    showStrategy(typeId) {
        const type = this.types.find(t => t.id === typeId);
        if (!type) return;

        const modal = document.getElementById('strategyModal');
        const title = document.getElementById('strategyTitle');
        const content = document.getElementById('strategyContent');

        title.textContent = `${type.name} - Strategy Guide`;
        content.innerHTML = type.strategy;

        modal.classList.add('active');
    }

    startPractice(typeId) {
        const type = this.types.find(t => t.id === typeId);
        if (!type) return;

        // Save selected type to session storage
        sessionStorage.setItem('practice_type', JSON.stringify(type));
        
        // Redirect to practice page
        window.location.href = `practice.html?type=${typeId}`;
    }
}

// Global functions
window.filterByCategory = function(category) {
    window.questionTypes.currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    window.questionTypes.renderQuestionTypes();
};

window.showAllTypes = function() {
    window.filterByCategory('all');
};

window.showStrategy = function(typeId) {
    window.questionTypes.showStrategy(typeId);
};

window.startPractice = function(typeId) {
    window.questionTypes.startPractice(typeId);
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.questionTypes = new QuestionTypes();
});
