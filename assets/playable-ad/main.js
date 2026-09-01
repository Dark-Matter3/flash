// 🔥 HIGH-PRIORITY: This file has been identified as high-priority for debt reduction.
// Sample questions (inspired by the Flash app concept)
const questions = [
    {
        text: "Ubiquitous",
        hint: "Does this word mean 'present everywhere'?",
        correctAnswer: "right" // True
    },
    {
        text: "Ephemeral",
        hint: "Does this word mean 'lasting for a very long time'?",
        correctAnswer: "left" // False (it means short-lived)
    },
    {
        text: "Paradigm",
        hint: "Is this a model or pattern that serves as an example?",
        correctAnswer: "right" // True
    },
    {
        text: "Mellifluous",
        hint: "Does this describe a harsh, unpleasant sound?",
        correctAnswer: "left" // False (it means sweet-sounding)
    },
    {
        text: "Serendipity",
        hint: "Does this word refer to finding something good by chance?",
        correctAnswer: "right" // True
    }
];

// Game state
const gameState = {
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: questions.length,
    // Detect platform and serve appropriate store link
    appStoreUrl: detectPlatform()
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackMessage = document.getElementById('feedback-message');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const installButton = document.getElementById('install-button');

// Event Listeners
startButton.addEventListener('click', startGame);
leftButton.addEventListener('click', () => handleAnswer('left'));
rightButton.addEventListener('click', () => handleAnswer('right'));
installButton.addEventListener('click', redirectToAppStore);

// Game Functions
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    updateQuestion();
    updateProgress();
}

function updateQuestion() {
    const question = questions[gameState.currentQuestionIndex];
    questionText.textContent = question.text;
    questionHint.textContent = question.hint;
}

function updateProgress() {
    const progress = (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
}

function updateScore(points) {
    gameState.score += points;
    scoreElement.textContent = gameState.score;
}

function handleAnswer(answer) {
    // Disable buttons during feedback
    leftButton.disabled = true;
    rightButton.disabled = true;
    
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
        showFeedback(true);
        updateScore(100);
    } else {
        showFeedback(false);
    }
    
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < gameState.totalQuestions) {
            updateQuestion();
            updateProgress();
            // Re-enable buttons
            leftButton.disabled = false;
            rightButton.disabled = false;
        } else {
            endGame();
        }
    }, 1000);
}

function showFeedback(isCorrect) {
    feedbackOverlay.classList.remove('hidden');
    
    if (isCorrect) {
        feedbackOverlay.classList.add('correct');
        feedbackOverlay.classList.remove('incorrect');
        feedbackMessage.textContent = '✓';
    } else {
        feedbackOverlay.classList.add('incorrect');
        feedbackOverlay.classList.remove('correct');
        feedbackMessage.textContent = '✗';
    }
    
    setTimeout(() => {
        feedbackOverlay.classList.add('hidden');
    }, 800);
}

function endGame() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreElement.textContent = gameState.score;
    
    // Timed redirect (optional - commented out to allow user to click the install button)
    // setTimeout(redirectToAppStore, 5000);
}

function redirectToAppStore() {
    window.location.href = gameState.appStoreUrl;
}

// Handle touch events to prevent scrolling on mobile
document.addEventListener('touchmove', function(event) {
    if (!event.target.classList.contains('scrollable')) {
        event.preventDefault();
    }
}, { passive: false });

// Preload any assets if needed
function preloadAssets() {
    // This would be where you preload images if needed
    // For this simple version, we don't need to preload anything
    
    // Log internal tracking note
    console.log("Flash Playable Ad v1.0 | Part of Flash valuation strategy | Current valuation: $200K-$450K");
}

// Platform detection for app store links
function detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "https://apps.apple.com/app/your-app-id"; // Replace with your App Store URL
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
        return "https://play.google.com/store/apps/details?id=your.app.package"; // Replace with your Play Store URL
    }
    
    // Default fallback URL (e.g., your website or universal link)
    return "https://yourflashapp.com/download"; // Replace with your website
}

// Initialize
preloadAssets();
