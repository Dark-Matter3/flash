/**
 * Flash Mini Demo - Swipe Card Game
 * ==================================
 *
 * A binary swipe-based vocabulary game that mimics Flash's core gameplay.
 *
 * INTERACTION MODEL:
 * - Swipe card left/right (touch or mouse drag)
 * - Click left/right choice buttons
 * - Keyboard: ← → arrows, R to restart
 *
 * QUESTION FORMAT:
 * Each question has exactly 2 options (left vs right).
 * {
 *   id: 'q1',
 *   type: 'Grammar',
 *   prompt: 'She ___ a student.',
 *   leftOption: 'is',
 *   rightOption: 'are',
 *   correctSide: 'left',
 *   explanation: 'We use "is" with she/he/it.'
 * }
 */

(function () {
  'use strict';

  // ==========================================
  // QUESTION DATA - Binary format (left vs right)
  // ==========================================
  const QUESTIONS = [
    {
      id: 'q1',
      type: 'Grammar',
      prompt: 'She ___ a student.',
      leftOption: 'is',
      rightOption: 'are',
      correctSide: 'left',
      explanation: 'Use "is" with he/she/it.',
    },
    {
      id: 'q2',
      type: 'Grammar',
      prompt: 'They ___ happy.',
      leftOption: 'is',
      rightOption: 'are',
      correctSide: 'right',
      explanation: 'Use "are" with they/we/you.',
    },
    {
      id: 'q3',
      type: 'Past Simple',
      prompt: 'Yesterday I ___ to work.',
      leftOption: 'went',
      rightOption: 'goed',
      correctSide: 'left',
      explanation: '"Went" is the irregular past of "go".',
    },
    {
      id: 'q4',
      type: 'Past Simple',
      prompt: 'She ___ a cake.',
      leftOption: 'maked',
      rightOption: 'made',
      correctSide: 'right',
      explanation: '"Made" is the irregular past of "make".',
    },
    {
      id: 'q5',
      type: 'Prepositions',
      prompt: 'The meeting is ___ Monday.',
      leftOption: 'on',
      rightOption: 'in',
      correctSide: 'left',
      explanation: 'Use "on" with days of the week.',
    },
    {
      id: 'q6',
      type: 'Prepositions',
      prompt: 'She was born ___ 1995.',
      leftOption: 'at',
      rightOption: 'in',
      correctSide: 'right',
      explanation: 'Use "in" with years and months.',
    },
    {
      id: 'q7',
      type: 'Prepositions',
      prompt: 'Class starts ___ 9 AM.',
      leftOption: 'at',
      rightOption: 'on',
      correctSide: 'left',
      explanation: 'Use "at" with specific times.',
    },
    {
      id: 'q8',
      type: 'Vocabulary',
      prompt: '"Reliable" means...',
      leftOption: 'can be trusted',
      rightOption: 'breaks easily',
      correctSide: 'left',
      explanation: 'Reliable = dependable, trustworthy.',
    },
    {
      id: 'q9',
      type: 'Vocabulary',
      prompt: '"Focus" means...',
      leftOption: 'to ignore',
      rightOption: 'to concentrate',
      correctSide: 'right',
      explanation: 'Focus = concentrate attention.',
    },
    {
      id: 'q10',
      type: 'Vocabulary',
      prompt: '"Improve" means...',
      leftOption: 'make better',
      rightOption: 'make worse',
      correctSide: 'left',
      explanation: 'Improve = get better at something.',
    },
    {
      id: 'q11',
      type: 'Collocation',
      prompt: '___ homework',
      leftOption: 'do',
      rightOption: 'make',
      correctSide: 'left',
      explanation: 'We say "do homework", not "make".',
    },
    {
      id: 'q12',
      type: 'Collocation',
      prompt: '___ progress',
      leftOption: 'do',
      rightOption: 'make',
      correctSide: 'right',
      explanation: 'We say "make progress", not "do".',
    },
  ];

  // ==========================================
  // GAME STATE
  // ==========================================
  let state = {
    currentIndex: 0,
    score: 0,
    streak: 0,
    highStreak: 0,
    answered: false,
    questionOrder: [],
    missedQuestions: [],
  };

  // Swipe state
  let swipe = {
    startX: 0,
    currentX: 0,
    isDragging: false,
  };

  // Constants
  const SWIPE_THRESHOLD = 80;
  const FEEDBACK_DELAY = 800;
  const CARD_ROTATE_FACTOR = 0.1;

  // ==========================================
  // DOM REFERENCES
  // ==========================================
  let elements = {};

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  function setup() {
    const container = document.getElementById('flash-demo');
    if (!container) {
      console.warn('Flash Demo: Container #flash-demo not found');
      return;
    }

    container.innerHTML = buildDemoHTML();
    cacheElements();
    bindEvents();
    resetGame();
  }

  function buildDemoHTML() {
    return `
      <div class="container">
        <div class="flash-demo__header">
          <h2 class="flash-demo__title" id="demo-title">Try Flash</h2>
          <p class="flash-demo__subtitle">Swipe left or right to answer. How long can you keep your streak?</p>
          <p class="flash-demo__beta-notice">🧪 This is a mini demo. <a href="#contact">Join the closed beta</a> to try the full app!</p>
        </div>

        <!-- Stats Bar -->
        <div class="flash-demo__stats">
          <div class="flash-demo__stat">
            <span class="flash-demo__stat-label">Score</span>
            <span class="flash-demo__stat-value" id="demo-score">0</span>
          </div>
          <div class="flash-demo__stat flash-demo__stat--streak">
            <span class="flash-demo__stat-label">🔥 Streak</span>
            <span class="flash-demo__stat-value" id="demo-streak">0</span>
          </div>
          <div class="flash-demo__stat">
            <span class="flash-demo__stat-label">Progress</span>
            <span class="flash-demo__stat-value" id="demo-progress">1/12</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="flash-demo__progress-bar">
          <div class="flash-demo__progress-fill" id="demo-progress-fill"></div>
        </div>

        <!-- Swipe Card Area -->
        <div class="flash-demo__card-area">
          <div class="flash-demo__card" id="demo-card">
            <span class="flash-demo__type" id="demo-type">Grammar</span>
            <p class="flash-demo__prompt" id="demo-prompt">Loading...</p>

            <!-- Feedback Overlay (shown on answer) -->
            <div class="flash-demo__card-feedback" id="demo-card-feedback">
              <span class="flash-demo__card-feedback-icon" id="demo-feedback-icon">✅</span>
              <span class="flash-demo__card-feedback-text" id="demo-feedback-text">Correct!</span>
            </div>
          </div>

          <!-- Swipe Indicators -->
          <div class="flash-demo__swipe-hint flash-demo__swipe-hint--left" id="hint-left">
            <span>←</span>
          </div>
          <div class="flash-demo__swipe-hint flash-demo__swipe-hint--right" id="hint-right">
            <span>→</span>
          </div>
        </div>

        <!-- Choice Buttons -->
        <div class="flash-demo__choices">
          <button class="flash-demo__choice flash-demo__choice--left" id="choice-left" type="button">
            <span class="flash-demo__choice-arrow">←</span>
            <span class="flash-demo__choice-text" id="choice-left-text">Option A</span>
          </button>
          <button class="flash-demo__choice flash-demo__choice--right" id="choice-right" type="button">
            <span class="flash-demo__choice-text" id="choice-right-text">Option B</span>
            <span class="flash-demo__choice-arrow">→</span>
          </button>
        </div>

        <!-- Helper Text -->
        <p class="flash-demo__tip">
          Swipe the card or use <kbd>←</kbd> <kbd>→</kbd> arrow keys
        </p>

        <!-- Restart Button -->
        <div class="flash-demo__controls">
          <button class="flash-demo__btn" id="demo-restart" type="button">
            Restart Demo
          </button>
        </div>

        <!-- Beta CTA -->
        <div class="flash-demo__beta-cta">
          <p>Want the full experience? <a href="#contact">Request closed beta access</a></p>
        </div>

        <!-- Screen Reader Announcements -->
        <div class="flash-demo__sr-only" id="demo-announcer" aria-live="assertive"></div>
      </div>
    `;
  }

  function cacheElements() {
    elements = {
      card: document.getElementById('demo-card'),
      type: document.getElementById('demo-type'),
      prompt: document.getElementById('demo-prompt'),
      cardFeedback: document.getElementById('demo-card-feedback'),
      feedbackIcon: document.getElementById('demo-feedback-icon'),
      feedbackText: document.getElementById('demo-feedback-text'),
      choiceLeft: document.getElementById('choice-left'),
      choiceRight: document.getElementById('choice-right'),
      choiceLeftText: document.getElementById('choice-left-text'),
      choiceRightText: document.getElementById('choice-right-text'),
      hintLeft: document.getElementById('hint-left'),
      hintRight: document.getElementById('hint-right'),
      score: document.getElementById('demo-score'),
      streak: document.getElementById('demo-streak'),
      progress: document.getElementById('demo-progress'),
      progressFill: document.getElementById('demo-progress-fill'),
      restartBtn: document.getElementById('demo-restart'),
      announcer: document.getElementById('demo-announcer'),
    };
  }

  function bindEvents() {
    // Choice button clicks
    elements.choiceLeft.addEventListener('click', () => handleAnswer('left'));
    elements.choiceRight.addEventListener('click', () => handleAnswer('right'));

    // Restart
    elements.restartBtn.addEventListener('click', handleRestart);

    // Keyboard
    document.addEventListener('keydown', handleKeyboard);

    // Swipe/Drag events on card
    const card = elements.card;

    // Mouse events
    card.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Touch events
    card.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  }

  // ==========================================
  // DRAG/SWIPE HANDLING
  // ==========================================
  function onDragStart(e) {
    if (state.answered) return;

    swipe.isDragging = true;
    swipe.startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    swipe.currentX = swipe.startX;

    elements.card.style.transition = 'none';
    elements.card.classList.add('flash-demo__card--dragging');
  }

  function onDragMove(e) {
    if (!swipe.isDragging || state.answered) return;

    swipe.currentX = e.type.includes('touch')
      ? e.touches[0].clientX
      : e.clientX;
    const deltaX = swipe.currentX - swipe.startX;

    // Apply transform
    const rotation = deltaX * CARD_ROTATE_FACTOR;
    elements.card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;

    // Show swipe hints based on direction
    const threshold = SWIPE_THRESHOLD * 0.5;
    if (deltaX < -threshold) {
      elements.hintLeft.classList.add('flash-demo__swipe-hint--active');
      elements.hintRight.classList.remove('flash-demo__swipe-hint--active');
    } else if (deltaX > threshold) {
      elements.hintRight.classList.add('flash-demo__swipe-hint--active');
      elements.hintLeft.classList.remove('flash-demo__swipe-hint--active');
    } else {
      elements.hintLeft.classList.remove('flash-demo__swipe-hint--active');
      elements.hintRight.classList.remove('flash-demo__swipe-hint--active');
    }

    // Prevent scroll on touch
    if (e.type.includes('touch') && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }

  function onDragEnd() {
    if (!swipe.isDragging) return;

    swipe.isDragging = false;
    elements.card.classList.remove('flash-demo__card--dragging');

    const deltaX = swipe.currentX - swipe.startX;

    // Reset hints
    elements.hintLeft.classList.remove('flash-demo__swipe-hint--active');
    elements.hintRight.classList.remove('flash-demo__swipe-hint--active');

    if (state.answered) {
      elements.card.style.transform = '';
      elements.card.style.transition = '';
      return;
    }

    // Check if swipe threshold met
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      const direction = deltaX < 0 ? 'left' : 'right';
      handleAnswer(direction);
    } else {
      // Snap back
      elements.card.style.transition = 'transform 0.3s ease';
      elements.card.style.transform = '';
    }
  }

  // ==========================================
  // GAME LOGIC
  // ==========================================
  function resetGame() {
    state = {
      currentIndex: 0,
      score: 0,
      streak: 0,
      highStreak: 0,
      answered: false,
      questionOrder: shuffleArray([...QUESTIONS]),
      missedQuestions: [],
    };

    updateStats();
    renderQuestion();
  }

  function getCurrentQuestion() {
    return state.questionOrder[state.currentIndex];
  }

  function getTotalQuestions() {
    return state.questionOrder.length;
  }

  function renderQuestion() {
    const question = getCurrentQuestion();

    if (!question) {
      renderComplete();
      return;
    }

    // Reset card state
    elements.card.className = 'flash-demo__card';
    elements.card.style.transform = '';
    elements.card.style.transition = '';
    elements.cardFeedback.classList.remove(
      'flash-demo__card-feedback--visible'
    );

    // Update content
    elements.type.textContent = question.type;
    elements.prompt.textContent = question.prompt;
    elements.choiceLeftText.textContent = question.leftOption;
    elements.choiceRightText.textContent = question.rightOption;

    // Reset choice buttons
    elements.choiceLeft.disabled = false;
    elements.choiceRight.disabled = false;
    elements.choiceLeft.className =
      'flash-demo__choice flash-demo__choice--left';
    elements.choiceRight.className =
      'flash-demo__choice flash-demo__choice--right';

    state.answered = false;

    // Animate card in
    elements.card.classList.add('flash-demo__card--enter');
    setTimeout(() => {
      elements.card.classList.remove('flash-demo__card--enter');
    }, 300);

    announce(
      `Question ${state.currentIndex + 1}. ${question.type}. ${
        question.prompt
      }. Left: ${question.leftOption}. Right: ${question.rightOption}.`
    );
  }

  function handleAnswer(side) {
    if (state.answered) return;

    state.answered = true;

    const question = getCurrentQuestion();
    const isCorrect = side === question.correctSide;
    const selectedBtn = side === 'left' ? elements.choiceLeft : elements.choiceRight;

    // Apply flash animation to card and selected button
    const flashClass = isCorrect ? 'flash-correct' : 'flash-wrong';
    elements.card.classList.add(flashClass);
    selectedBtn.classList.add(flashClass);
    
    // Remove flash classes after animation completes
    setTimeout(() => {
      elements.card.classList.remove(flashClass);
      selectedBtn.classList.remove(flashClass);
    }, 200);

    // Update stats
    if (isCorrect) {
      state.score++;
      state.streak++;
      if (state.streak > state.highStreak) {
        state.highStreak = state.streak;
      }
    } else {
      state.streak = 0;
      // Micro-spaced repetition: reinsert wrong question
      if (!state.missedQuestions.includes(question.id)) {
        state.missedQuestions.push(question.id);
        const reinsertIndex = Math.min(
          state.currentIndex + 3,
          getTotalQuestions()
        );
        state.questionOrder.splice(reinsertIndex, 0, {
          ...question,
          id: question.id + '_retry',
        });
      }
    }

    updateStats();

    // Show feedback on card
    showCardFeedback(isCorrect, question.explanation);

    // Animate card exit
    elements.card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    const exitX = side === 'left' ? -300 : 300;
    const exitRotation = side === 'left' ? -15 : 15;
    elements.card.style.transform = `translateX(${exitX}px) rotate(${exitRotation}deg)`;
    elements.card.style.opacity = '0.5';

    // Highlight correct choice
    if (question.correctSide === 'left') {
      elements.choiceLeft.classList.add('flash-demo__choice--correct');
      if (!isCorrect)
        elements.choiceRight.classList.add('flash-demo__choice--wrong');
    } else {
      elements.choiceRight.classList.add('flash-demo__choice--correct');
      if (!isCorrect)
        elements.choiceLeft.classList.add('flash-demo__choice--wrong');
    }

    // Disable buttons
    elements.choiceLeft.disabled = true;
    elements.choiceRight.disabled = true;

    // Announce result
    announce(isCorrect ? 'Correct!' : `Incorrect. ${question.explanation}`);

    // Auto-advance after delay
    setTimeout(() => {
      state.currentIndex++;
      elements.card.style.opacity = '1';
      renderQuestion();
    }, FEEDBACK_DELAY);
  }

  function showCardFeedback(isCorrect, explanation) {
    elements.feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    elements.feedbackText.textContent = isCorrect ? 'Correct!' : explanation;
    elements.cardFeedback.className =
      'flash-demo__card-feedback flash-demo__card-feedback--visible';
    elements.cardFeedback.classList.add(
      isCorrect
        ? 'flash-demo__card-feedback--correct'
        : 'flash-demo__card-feedback--wrong'
    );
  }

  function renderComplete() {
    const percentage = Math.round((state.score / QUESTIONS.length) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪';

    elements.card.className = 'flash-demo__card flash-demo__card--complete';
    elements.card.style.transform = '';
    elements.card.style.opacity = '1';
    elements.card.innerHTML = `
      <div class="flash-demo__complete">
        <div class="flash-demo__complete-emoji">${emoji}</div>
        <h3 class="flash-demo__complete-title">Demo Complete!</h3>
        <div class="flash-demo__complete-stats">
          <div class="flash-demo__complete-stat">
            <span class="flash-demo__complete-stat-value">${state.score}/${
      QUESTIONS.length
    }</span>
            <span class="flash-demo__complete-stat-label">Score</span>
          </div>
          <div class="flash-demo__complete-stat">
            <span class="flash-demo__complete-stat-value">${
              state.highStreak
            }</span>
            <span class="flash-demo__complete-stat-label">Best Streak</span>
          </div>
        </div>
        <p class="flash-demo__complete-cta">
          ${
            percentage >= 80
              ? 'Excellent!'
              : percentage >= 50
              ? 'Good effort!'
              : 'Keep practicing!'
          }
        </p>
        <p class="flash-demo__complete-beta">
          🧪 This was just a taste!<br>
          <a href="#contact">Join the closed beta</a> for 1000+ questions & full features.
        </p>
      </div>
    `;

    // Hide choice buttons
    elements.choiceLeft.style.visibility = 'hidden';
    elements.choiceRight.style.visibility = 'hidden';

    announce(
      `Demo complete. You scored ${state.score} out of ${QUESTIONS.length}. Best streak: ${state.highStreak}.`
    );
  }

  function updateStats() {
    elements.score.textContent = state.score;
    elements.streak.textContent = state.streak;
    elements.progress.textContent = `${Math.min(
      state.currentIndex + 1,
      QUESTIONS.length
    )}/${QUESTIONS.length}`;

    const progressPercent = (state.currentIndex / QUESTIONS.length) * 100;
    elements.progressFill.style.width = `${progressPercent}%`;

    // Streak emphasis animation
    if (state.streak >= 3) {
      elements.streak.parentElement.classList.add('flash-demo__stat--hot');
    } else {
      elements.streak.parentElement.classList.remove('flash-demo__stat--hot');
    }
  }

  function handleRestart() {
    // Reset visibility of choice buttons
    elements.choiceLeft.style.visibility = '';
    elements.choiceRight.style.visibility = '';

    resetGame();
    announce('Demo restarted.');
  }

  // ==========================================
  // KEYBOARD HANDLING
  // ==========================================
  function handleKeyboard(e) {
    const demoContainer = document.getElementById('flash-demo');
    if (!demoContainer) return;

    // Don't capture if typing in input
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA')
    ) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (!state.answered) {
          e.preventDefault();
          handleAnswer('left');
        }
        break;
      case 'ArrowRight':
        if (!state.answered) {
          e.preventDefault();
          handleAnswer('right');
        }
        break;
      case 'r':
      case 'R':
        handleRestart();
        break;
    }
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function announce(message) {
    if (elements.announcer) {
      elements.announcer.textContent = message;
    }
  }

  // ==========================================
  // START
  // ==========================================
  init();
})();
