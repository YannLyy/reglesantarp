// Navigation entre les catégories
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.category-section');

    // ========== NAVIGATION ==========
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));

            const targetSection = document.getElementById(category);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        });
    });

    // ========== BARRE DE RECHERCHE ==========
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        clearSearch.style.display = searchTerm ? 'block' : 'none';
        
        document.querySelectorAll('.rule-card').forEach(card => {
            const content = card.textContent.toLowerCase();
            const ruleContent = card.querySelector('.rule-content');
            
            // Recherche de mots complets uniquement
            const words = searchTerm.split(/\s+/);
            const allWordsFound = words.every(word => {
                if (word.length === 0) return true;
                // Créer un regex pour chercher le mot complet (avec limites de mots)
                const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                return regex.test(content);
            });
            
            if (allWordsFound && searchTerm) {
                card.style.display = 'block';
                
                // Ouvrir automatiquement les cartes trouvées
                if (!card.classList.contains('collapsed')) {
                    // Déjà ouvert
                } else {
                    card.classList.remove('collapsed');
                    ruleContent.style.maxHeight = ruleContent.scrollHeight + 'px';
                }
                
                // Highlight du texte trouvé
                highlightText(card, searchTerm);
            } else {
                card.style.display = searchTerm ? 'none' : 'block';
                removeHighlight(card);
            }
        });
        
        // Si pas de recherche, tout afficher
        if (!searchTerm) {
            document.querySelectorAll('.rule-card').forEach(card => {
                card.style.display = 'block';
                removeHighlight(card);
            });
        }
    });
    
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        document.querySelectorAll('.rule-card').forEach(card => {
            card.style.display = 'block';
            removeHighlight(card);
        });
    });
    
    function highlightText(element, term) {
        if (!term) {
            removeHighlight(element);
            return;
        }
        
        const contentElement = element.querySelector('.rule-content');
        if (!contentElement) return;
        
        // Sauvegarder le HTML original si ce n'est pas déjà fait
        if (!contentElement.dataset.originalHtml) {
            contentElement.dataset.originalHtml = contentElement.innerHTML;
        }
        
        // Restaurer le HTML original
        contentElement.innerHTML = contentElement.dataset.originalHtml;
        
        // Diviser en mots individuels pour le highlight
        const words = term.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        
        // Pour chaque mot, créer un regex avec limites de mots
        words.forEach(word => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('\\b(' + escapedWord + ')\\b', 'gi');
            
            // Fonction récursive pour parcourir les nœuds texte
            function highlightNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (regex.test(text)) {
                        const span = document.createElement('span');
                        span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
                        node.parentNode.replaceChild(span, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && 
                          !node.classList.contains('highlight') &&
                          node.tagName !== 'SCRIPT' && 
                          node.tagName !== 'STYLE') {
                    Array.from(node.childNodes).forEach(child => highlightNode(child));
                }
            }
            
            highlightNode(contentElement);
        });
    }
    
    function removeHighlight(element) {
        const contentElement = element.querySelector('.rule-content');
        if (contentElement && contentElement.dataset.originalHtml) {
            contentElement.innerHTML = contentElement.dataset.originalHtml;
        }
    }

    // ========== TOUT OUVRIR / TOUT FERMER ==========
    document.getElementById('expandAll').addEventListener('click', function() {
        document.querySelectorAll('.rule-card.collapsed').forEach(card => {
            card.classList.remove('collapsed');
            const content = card.querySelector('.rule-content');
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });
    
    document.getElementById('collapseAll').addEventListener('click', function() {
        document.querySelectorAll('.rule-card:not(.collapsed)').forEach(card => {
            card.classList.add('collapsed');
            const content = card.querySelector('.rule-content');
            content.style.maxHeight = '0px';
        });
    });

    // ========== MODE SOMBRE ==========
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // ========== BARRE DE PROGRESSION ==========
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // ========== QUIZ ==========
    const quizQuestions = [
        {
            question: "Combien de temps minimum de RP avant un braquage de joueur ?",
            options: ["30 minutes", "20 minutes", "10 minutes", "Pas de minimum"],
            correct: 1,
            rule: "1.2 - Roleplay"
        },
        {
            question: "Combien de forces de l'ordre minimum pour braquer une banque ?",
            options: ["1", "2", "3", "5"],
            correct: 2,
            rule: "3.2 - Braquages"
        },
        {
            question: "Le WinRP c'est quoi ?",
            options: [
                "Être très fort en RP",
                "Forcer des actions sans laisser le choix",
                "Tuer sans raison",
                "Utiliser des armes puissantes"
            ],
            correct: 1,
            rule: "1.2 - Roleplay"
        },
        {
            question: "Peut-on sortir son arme en zone verte ?",
            options: ["Oui toujours", "Non jamais", "Seulement si policier", "Seulement dissimulée"],
            correct: 1,
            rule: "4.1 - Zone Verte"
        },
        {
            question: "Combien d'otages maximum lors d'une prise d'otage ?",
            options: ["1", "2", "3", "4"],
            correct: 1,
            rule: "3.4 - Prises d'otages"
        },
        {
            question: "Le micro est-il obligatoire pour jouer ?",
            options: ["Non", "Oui", "Seulement pour les criminels", "Seulement pour la police"],
            correct: 1,
            rule: "1.5 - Communication"
        },
        {
            question: "Combien de membres maximum par organisation criminelle ?",
            options: ["25", "15", "20", "10"],
            correct: 2,
            rule: "3.1 - Organisations Criminelles"
        },
        {
            question: "Combien de membres maximum par organisation criminelle sur une scène ?",
            options: ["25", "15", "20", "10"],
            correct: 1,
            rule: "3.1 - Organisations Criminelles"
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let wrongAnswers = [];
    
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    
    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        wrongAnswers = [];
        showQuestion();
    }
    
    function showQuestion() {
        const container = document.getElementById('quizContainer');
        const q = quizQuestions[currentQuestion];
        
        container.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1}/${quizQuestions.length}</h3>
                <p style="font-size: 1.2rem; color: var(--blue-dark); margin-bottom: 20px;">${q.question}</p>
                <div class="quiz-options">
                    ${q.options.map((option, index) => `
                        <button class="quiz-option" onclick="checkAnswer(${index})">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    window.checkAnswer = function(selected) {
        const q = quizQuestions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === q.correct) {
                option.classList.add('correct');
            } else if (index === selected && selected !== q.correct) {
                option.classList.add('incorrect');
            }
        });
        
        if (selected === q.correct) {
            score++;
        } else {
            wrongAnswers.push({
                question: q.question,
                rule: q.rule,
                yourAnswer: q.options[selected],
                correctAnswer: q.options[q.correct]
            });
        }
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 2000);
    };
    
    function showResults() {
        const container = document.getElementById('quizContainer');
        const percentage = Math.round((score / quizQuestions.length) * 100);
        
        let resultMessage = '';
        if (percentage === 100) {
            resultMessage = "🎉 Parfait ! Vous maîtrisez le règlement !";
        } else if (percentage >= 75) {
            resultMessage = "👍 Très bien ! Quelques petites erreurs à corriger.";
        } else if (percentage >= 50) {
            resultMessage = "📖 Pas mal, mais relisez certaines règles !";
        } else {
            resultMessage = "⚠️ Il faut réviser le règlement !";
        }
        
        let wrongAnswersHTML = '';
        if (wrongAnswers.length > 0) {
            wrongAnswersHTML = `
                <div class="quiz-report">
                    <h4 style="color: var(--blue-dark); margin-bottom: 15px;">📋 Règles à réviser :</h4>
                    ${wrongAnswers.map(wa => `
                        <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;">
                            <p style="margin: 5px 0;"><strong>❌ ${wa.question}</strong></p>
                            <p style="margin: 5px 0; color: #dc2626;">Votre réponse : ${wa.yourAnswer}</p>
                            <p style="margin: 5px 0; color: #16a34a;">Bonne réponse : ${wa.correctAnswer}</p>
                            <p style="margin: 5px 0; font-style: italic; color: #f59e0b;">→ Voir règle : ${wa.rule}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = `
            <div class="quiz-result">
                <h3>${resultMessage}</h3>
                <div class="quiz-score">${score}/${quizQuestions.length}</div>
                <p>Score : ${percentage}%</p>
                ${wrongAnswersHTML}
                <button class="quiz-restart" onclick="location.reload()">🔄 Recommencer le Quiz</button>
            </div>
        `;
    }

    // ========== ANIMATIONS ==========
    const ruleCards = document.querySelectorAll('.rule-card');
    
    ruleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    ruleCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ========== NAVIGATION CLAVIER ==========
    navButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextButton = navButtons[index + 1] || navButtons[0];
                nextButton.focus();
                nextButton.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevButton = navButtons[index - 1] || navButtons[navButtons.length - 1];
                prevButton.focus();
                prevButton.click();
            }
        });
    });

    // ========== EASTER EGG ==========
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            document.body.style.animation = 'rainbow 2s linear infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('%cAntalyaRP', 'font-size: 50px; color: #3b82f6; font-weight: bold; text-shadow: 2px 2px 5px rgba(0,0,0,0.3);');
    console.log('%cBienvenue sur le règlement officiel !', 'font-size: 16px; color: #60a5fa;');
});

// Fonction pour plier/déplier les cartes de règles
function toggleRule(header) {
    const card = header.parentElement;
    card.classList.toggle('collapsed');
    
    const content = card.querySelector('.rule-content');
    if (card.classList.contains('collapsed')) {
        content.style.maxHeight = '0px';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}
