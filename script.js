// Navigation entre les catégories
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.category-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Retirer la classe active de tous les boutons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            // Masquer toutes les sections
            sections.forEach(section => section.classList.remove('active'));

            // Afficher la section correspondante
            const targetSection = document.getElementById(category);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Smooth scroll vers le haut du contenu
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        });
    });

    // Ajouter un effet de survol sur les cartes de règles
    const ruleCards = document.querySelectorAll('.rule-card');
    
    ruleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Animation au scroll
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

    // Amélioration de l'accessibilité - navigation au clavier
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

    // Easter egg : Konami Code
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

    // Style pour l'easter egg
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
    
    // Animation smooth
    const content = card.querySelector('.rule-content');
    if (card.classList.contains('collapsed')) {
        content.style.maxHeight = '0px';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
    }
}
