/**
 * Flash Mini Demo - Game Logic
 * ============================
 *
 * HOW TO CUSTOMIZE QUESTIONS:
 * ---------------------------
 * 1. Find the QUESTIONS array below (around line 30)
 * 2. Each question object has:
 *    - id: unique identifier (string)
 *    - type: category label shown above question (Grammar, Vocabulary, Collocation, etc.)
 *    - prompt: the question text displayed to user
 *    - options: array of 2-4 answer strings
 *    - answerIndex: zero-based index of correct answer in options array
 *    - explanation: shown after answering (correct or wrong)
 *
 * 3. To add a question:
 *    {
 *        id: 'q13',
 *        type: 'Grammar',
 *        prompt: 'She ___ to the store yesterday.',
 *        options: ['go', 'goes', 'went', 'gone'],
 *        answerIndex: 2,
 *        explanation: '"Went" is the past simple form of "go".'
 *    }
 *
 * 4. Question difficulty should be A2-B1 level for marketing demo purposes.
 *
 * KEYBOARD CONTROLS:
 * - Keys 1-4: Select answer options
 * - Enter: Proceed to next question
 * - R: Restart demo
 */

(function () {
  'use strict';

  // ==========================================
  // QUESTION DATA - Edit this array to customize
  // ==========================================
  const QUESTIONS = [
    {
      id: 'q1',
      type: 'Grammar',
      prompt: 'She ___ a student at Oxford University.',
      options: ['am', 'is', 'are', 'be'],
      answerIndex: 1,
      explanation: 'We use "is" with he/she/it. "She is a student."',
    },
    {
      id: 'q2',
      type: 'Grammar',
      prompt: 'They ___ very happy about the news.',
      options: ['am', 'is', 'are', 'was'],
      answerIndex: 2,
      explanation: 'We use "are" with they/we/you (plural). "They are happy."',
    },
    {
      id: 'q3',
      type: 'Past Simple',
      prompt: 'Yesterday, I ___ to the cinema.',
      options: ['go', 'goes', 'went', 'gone'],
      answerIndex: 2,
      explanation: '"Went" is the irregular past simple of "go".',
    },
    {
      id: 'q4',
      type: 'Past Simple',
      prompt: 'She ___ a delicious cake for the party.',
      options: ['make', 'made', 'makes', 'making'],
      answerIndex: 1,
      explanation: '"Made" is the irregular past simple of "make".',
    },
    {
      id: 'q5',
      type: 'Prepositions',
      prompt: 'The meeting is ___ Monday.',
      options: ['at', 'in', 'on', 'to'],
      answerIndex: 2,
      explanation: 'We use "on" with days of the week: on Monday, on Friday.',
    },
    {
      id: 'q6',
      type: 'Prepositions',
      prompt: 'She was born ___ 1995.',
      options: ['at', 'in', 'on', 'during'],
      answerIndex: 1,
      explanation: 'We use "in" with years and months: in 1995, in July.',
    },
    {
      id: 'q7',
      type: 'Prepositions',
      prompt: "The train leaves ___ 3 o'clock.",
      options: ['at', 'in', 'on', 'by'],
      answerIndex: 0,
      explanation: 'We use "at" with specific times: at 3 o\'clock, at noon.',
    },
    {
      id: 'q8',
      type: 'Vocabulary',
      prompt: 'What does "reliable" mean?',
      options: ['Expensive', 'Dependable', 'Fast', 'Boring'],
      answerIndex: 1,
      explanation:
        '"Reliable" means trustworthy, someone or something you can depend on.',
    },
    {
      id: 'q9',
      type: 'Vocabulary',
      prompt: 'What does "improve" mean?',
      options: ['To break', 'To forget', 'To make better', 'To ignore'],
      answerIndex: 2,
      explanation:
        '"Improve" means to make something better or to get better at something.',
    },
    {
      id: 'q10',
      type: 'Vocabulary',
      prompt: 'What does "focus" mean?',
      options: ['To concentrate', 'To sleep', 'To argue', 'To travel'],
      answerIndex: 0,
      explanation:
        '"Focus" means to concentrate your attention on something specific.',
    },
    {
      id: 'q11',
      type: 'Collocation',
      prompt: 'Complete: "___ homework"',
      options: ['make', 'do', 'take', 'have'],
      answerIndex: 1,
      explanation:
        'We say "do homework" (not make). Similar: do exercise, do the dishes.',
    },
    {
      id: 'q12',
      type: 'Collocation',
      prompt: 'Complete: "___ progress"',
      options: ['do', 'make', 'take', 'get'],
      answerIndex: 1,
      explanation:
        'We say "make progress" (not do). Similar: make a decision, make a mistake.',
    },
  ];

  // ==========================================
  // GAME STATE
  // ==========================================
  let state = {
    currentIndex: 0,
    score: 0,
    streak: 0,
    answered: false,
    selectedAnswer: null,
    missedQuestions: [],
    questionOrder: [],
  };

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
                    <h2 class="flash-demo__title" id="demo-title">Try Flash (Mini Demo)</h2>
                    <p class="flash-demo__subtitle">Experience swipe-style learning right here. No download required.</p>
                    <span class="flash-demo__badge">✨ Beta Preview</span>
                </div>

                <div class="flash-demo__progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="flash-demo__progress-bar" id="demo-progress-bar"></div>
                </div>

                <div class="flash-demo__meta">
                    <div class="flash-demo__stat">
                        <span class="flash-demo__stat-icon">🏆</span>
                        <span>Score:</span>
                        <span class="flash-demo__stat-value" id="demo-score">0</span>
                    </div>
                    <div class="flash-demo__stat">
                        <span class="flash-demo__stat-icon">🔥</span>
                        <span>Streak:</span>
                        <span class="flash-demo__stat-value" id="demo-streak">0</span>
                    </div>
                    <div class="flash-demo__stat">
                        <span class="flash-demo__stat-icon">📊</span>
                        <span>Progress:</span>
                        <span class="flash-demo__stat-value" id="demo-progress-text">1/10</span>
                    </div>
                </div>

                <div class="flash-demo__card" id="demo-card">
                    <span class="flash-demo__type" id="demo-type">Grammar</span>
                    <p class="flash-demo__prompt" id="demo-prompt">Loading question...</p>

                    <div class="flash-demo__options" id="demo-options" role="group" aria-label="Answer options">
                    </div>

                    <div class="flash-demo__feedback" id="demo-feedback" role="status" aria-live="polite">
                    </div>
                </div>

                <div class="flash-demo__controls">
                    <button class="flash-demo__btn" id="demo-skip" type="button">Skip</button>
                    <button class="flash-demo__btn flash-demo__btn--primary" id="demo-next" type="button" disabled>Next →</button>
                    <button class="flash-demo__btn" id="demo-restart" type="button">Restart</button>
                </div>

                <p class="flash-demo__tip">
                    💡 Tip: Use <kbd>1</kbd>-<kbd>4</kbd> to select, <kbd>Enter</kbd> for next, <kbd>R</kbd> to restart
                </p>

                <div class="flash-demo__sr-only" id="demo-announcer" aria-live="assertive"></div>
            </div>
        `;
  }

  function cacheElements() {
    elements = {
      card: document.getElementById('demo-card'),
      type: document.getElementById('demo-type'),
      prompt: document.getElementById('demo-prompt'),
      options: document.getElementById('demo-options'),
      feedback: document.getElementById('demo-feedback'),
      score: document.getElementById('demo-score'),
      streak: document.getElementById('demo-streak'),
      progressText: document.getElementById('demo-progress-text'),
      progressBar: document.getElementById('demo-progress-bar'),
      nextBtn: document.getElementById('demo-next'),
      skipBtn: document.getElementById('demo-skip'),
      restartBtn: document.getElementById('demo-restart'),
      announcer: document.getElementById('demo-announcer'),
    };
  }

  function bindEvents() {
    elements.nextBtn.addEventListener('click', handleNext);
    elements.skipBtn.addEventListener('click', handleSkip);
    elements.restartBtn.addEventListener('click', handleRestart);
    document.addEventListener('keydown', handleKeyboard);
  }

  // ==========================================
  // GAME LOGIC
  // ==========================================
  function resetGame() {
    state = {
      currentIndex: 0,
      score: 0,
      streak: 0,
      answered: false,
      selectedAnswer: null,
      missedQuestions: [],
      questionOrder: shuffleArray([...QUESTIONS]).slice(0, 10),
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

    elements.type.textContent = question.type;
    elements.prompt.textContent = question.prompt;

    elements.options.innerHTML = '';
    question.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'flash-demo__option';
      btn.setAttribute('data-key', index + 1);
      btn.setAttribute('data-index', index);
      btn.textContent = option;
      btn.addEventListener('click', () => handleAnswer(index));
      elements.options.appendChild(btn);
    });

    elements.feedback.className = 'flash-demo__feedback';
    elements.feedback.textContent = '';

    elements.nextBtn.disabled = true;
    elements.skipBtn.disabled = false;
    state.answered = false;
    state.selectedAnswer = null;

    elements.card.classList.remove('flash-demo__card--animate');
    void elements.card.offsetWidth;
    elements.card.classList.add('flash-demo__card--animate');

    announce(
      `Question ${state.currentIndex + 1} of ${getTotalQuestions()}. ${
        question.type
      }. ${question.prompt}`
    );
  }

  function handleAnswer(selectedIndex) {
    if (state.answered) return;

    state.answered = true;
    state.selectedAnswer = selectedIndex;

    const question = getCurrentQuestion();
    const isCorrect = selectedIndex === question.answerIndex;

    if (isCorrect) {
      state.score += 1;
      state.streak += 1;
    } else {
      state.streak = 0;
      if (!state.missedQuestions.includes(question.id)) {
        state.missedQuestions.push(question.id);
        const reinsertIndex = Math.min(
          state.currentIndex + 3,
          getTotalQuestions()
        );
        if (reinsertIndex < getTotalQuestions()) {
          state.questionOrder.splice(reinsertIndex, 0, {
            ...question,
            id: question.id + '_retry',
          });
        }
      }
    }

    updateStats();

    const optionBtns = elements.options.querySelectorAll('.flash-demo__option');
    optionBtns.forEach((btn, index) => {
      btn.disabled = true;
      if (index === question.answerIndex) {
        btn.classList.add('flash-demo__option--correct');
      } else if (index === selectedIndex && !isCorrect) {
        btn.classList.add('flash-demo__option--wrong');
      }
    });

    showFeedback(isCorrect, question.explanation);

    elements.nextBtn.disabled = false;
    elements.skipBtn.disabled = true;

    announce(isCorrect ? 'Correct!' : 'Not quite. ' + question.explanation);
  }

  function showFeedback(isCorrect, explanation) {
    elements.feedback.className =
      'flash-demo__feedback flash-demo__feedback--visible';
    elements.feedback.classList.add(
      isCorrect
        ? 'flash-demo__feedback--correct'
        : 'flash-demo__feedback--wrong'
    );
    elements.feedback.innerHTML = isCorrect
      ? `<strong>✓ Correct!</strong> ${explanation}`
      : `<strong>✗ Not quite.</strong> ${explanation}`;
  }

  function handleNext() {
    if (!state.answered) return;

    state.currentIndex++;
    if (state.currentIndex >= getTotalQuestions()) {
      renderComplete();
    } else {
      renderQuestion();
    }
  }

  function handleSkip() {
    if (state.answered) return;

    state.streak = 0;
    updateStats();

    state.currentIndex++;
    if (state.currentIndex >= getTotalQuestions()) {
      renderComplete();
    } else {
      renderQuestion();
    }

    announce('Question skipped. Streak reset.');
  }

  function handleRestart() {
    resetGame();
    announce('Demo restarted.');
  }

  function renderComplete() {
    const percentage = Math.round((state.score / getTotalQuestions()) * 100);

    elements.card.innerHTML = `
            <div class="flash-demo__complete">
                <div class="flash-demo__complete-icon">🎉</div>
                <h3 class="flash-demo__complete-title">Demo Complete!</h3>
                <p class="flash-demo__complete-score">
                    You scored <strong>${
                      state.score
                    }/${getTotalQuestions()}</strong> (${percentage}%)
                </p>
                <p style="color: #757575; font-size: 1.4rem; margin-bottom: 0;">
                    ${
                      percentage >= 80
                        ? 'Excellent work!'
                        : percentage >= 50
                        ? 'Good effort!'
                        : 'Keep practicing!'
                    }
                    Download Flash for the full experience with thousands of questions.
                </p>
            </div>
        `;

    elements.nextBtn.disabled = true;
    elements.skipBtn.disabled = true;

    elements.progressBar.style.width = '100%';
    elements.progressText.textContent = `${getTotalQuestions()}/${getTotalQuestions()}`;

    announce(
      `Demo complete. You scored ${state.score} out of ${getTotalQuestions()}.`
    );
  }

  function updateStats() {
    elements.score.textContent = state.score;
    elements.streak.textContent = state.streak;
    elements.progressText.textContent = `${
      state.currentIndex + 1
    }/${getTotalQuestions()}`;

    const progressPercent = (state.currentIndex / getTotalQuestions()) * 100;
    elements.progressBar.style.width = `${progressPercent}%`;
  }

  // ==========================================
  // KEYBOARD HANDLING
  // ==========================================
  function handleKeyboard(e) {
    const demoContainer = document.getElementById('flash-demo');
    if (!demoContainer) return;

    const activeElement = document.activeElement;
    const isInputFocused =
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable);

    if (isInputFocused) return;

    switch (e.key) {
      case '1':
      case '2':
      case '3':
      case '4':
        const optionIndex = parseInt(e.key) - 1;
        const optionBtns = elements.options?.querySelectorAll(
          '.flash-demo__option'
        );
        if (optionBtns && optionBtns[optionIndex] && !state.answered) {
          handleAnswer(optionIndex);
        }
        break;
      case 'Enter':
        if (state.answered && elements.nextBtn && !elements.nextBtn.disabled) {
          handleNext();
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
