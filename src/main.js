import {
  HIRAGANA_MAP, HIRAGANA_ROMAJI, ALPHABET,
  JAPANESE_WORDS, ENGLISH_WORDS, shuffle,
} from './data.js';
import {
  playCorrectSE, playWrongSE, playTypeSE, playResultSE,
  playClickSE, playWordCompleteSE, startBgm, stopBgm, resumeAudio,
} from './audio.js';

// ========== State ==========
let currentMode = null; // 'key-hiragana' | 'key-alphabet' | 'word-japanese' | 'word-english'
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let wordTypedIndex = 0;
let isLocked = false; // prevent input during feedback
const TOTAL_QUESTIONS = 10;

// ========== DOM Helpers ==========
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ========== Navigation ==========
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  resumeAudio();
  playClickSE();
  const action = btn.dataset.action;

  switch (action) {
    case 'key-type':
      showScreen('screen-key-menu');
      break;
    case 'word-type':
      showScreen('screen-word-menu');
      break;
    case 'key-hiragana':
      startKeyGame('key-hiragana');
      break;
    case 'key-alphabet':
      startKeyGame('key-alphabet');
      break;
    case 'word-japanese':
      startWordGame('word-japanese');
      break;
    case 'word-english':
      startWordGame('word-english');
      break;
    case 'retry':
      if (currentMode && currentMode.startsWith('key-')) {
        startKeyGame(currentMode);
      } else if (currentMode && currentMode.startsWith('word-')) {
        startWordGame(currentMode);
      }
      break;
    case 'back-title':
      stopBgm();
      showScreen('screen-title');
      break;
  }
});

// ========== Key Typing Game ==========
function startKeyGame(mode) {
  currentMode = mode;
  currentIndex = 0;
  correctCount = 0;
  isLocked = false;

  if (mode === 'key-hiragana') {
    const hiraganaKeys = Object.keys(HIRAGANA_MAP);
    questions = shuffle(hiraganaKeys).slice(0, TOTAL_QUESTIONS);
  } else {
    questions = shuffle(ALPHABET).slice(0, TOTAL_QUESTIONS);
  }

  showScreen('screen-game-key');
  startBgm();
  showKeyQuestion();
}

function showKeyQuestion() {
  const q = questions[currentIndex];
  $('key-question').textContent = q;
  $('key-feedback').textContent = '';
  $('key-feedback').className = 'feedback';
  $('key-current').textContent = currentIndex + 1;
  $('key-progress').style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;

  if (currentMode === 'key-hiragana') {
    $('key-hint').textContent = `キーボードの「${HIRAGANA_ROMAJI[q]}」のさいしょのもじをおしてね`;
  } else {
    $('key-hint').textContent = `キーボードの「${q}」をおしてね`;
  }
}

function handleKeyInput(key) {
  if (isLocked) return;

  const q = questions[currentIndex];
  let expectedKey;

  if (currentMode === 'key-hiragana') {
    expectedKey = HIRAGANA_MAP[q];
  } else {
    expectedKey = q;
  }

  if (key === expectedKey) {
    // Correct
    isLocked = true;
    correctCount++;
    playCorrectSE();
    $('key-feedback').textContent = 'せいかい！';
    $('key-feedback').className = 'feedback correct';
    $('key-progress').style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

    setTimeout(() => {
      currentIndex++;
      isLocked = false;
      if (currentIndex >= TOTAL_QUESTIONS) {
        showResult();
      } else {
        showKeyQuestion();
      }
    }, 3000);
  } else {
    // Wrong
    playWrongSE();
    $('key-feedback').textContent = 'ちがうよ';
    $('key-feedback').className = 'feedback wrong';
    setTimeout(() => {
      if (!isLocked) {
        $('key-feedback').textContent = '';
        $('key-feedback').className = 'feedback';
      }
    }, 800);
  }
}

// ========== Word Typing Game ==========
function startWordGame(mode) {
  currentMode = mode;
  currentIndex = 0;
  correctCount = 0;
  wordTypedIndex = 0;
  isLocked = false;

  const wordList = mode === 'word-japanese' ? JAPANESE_WORDS : ENGLISH_WORDS;
  questions = shuffle(wordList).slice(0, TOTAL_QUESTIONS);

  showScreen('screen-game-word');
  startBgm();
  showWordQuestion();
}

function showWordQuestion() {
  const q = questions[currentIndex];
  wordTypedIndex = 0;

  // Show the word and its hint
  $('word-question').innerHTML = `
    <div>${q.display}</div>
    <div style="font-size: 1rem; color: #999; margin-top: 5px;">${q.hint !== q.display ? q.hint : ''}</div>
  `;

  $('word-feedback').textContent = '';
  $('word-feedback').className = 'feedback';
  $('word-current').textContent = currentIndex + 1;
  $('word-progress').style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;

  renderWordInput();
}

function renderWordInput() {
  const q = questions[currentIndex];
  const romaji = q.romaji;
  let html = '';

  for (let i = 0; i < romaji.length; i++) {
    let cls = 'char ';
    if (i < wordTypedIndex) {
      cls += 'typed';
    } else if (i === wordTypedIndex) {
      cls += 'current';
    } else {
      cls += 'remaining';
    }
    html += `<span class="${cls}">${romaji[i]}</span>`;
  }

  $('word-input-display').innerHTML = html;
}

function handleWordInput(key) {
  if (isLocked) return;

  const q = questions[currentIndex];
  const romaji = q.romaji;
  const expected = romaji[wordTypedIndex];

  if (key === expected) {
    // Correct character
    playTypeSE();
    wordTypedIndex++;
    renderWordInput();

    if (wordTypedIndex >= romaji.length) {
      // Word complete
      isLocked = true;
      correctCount++;
      playWordCompleteSE();
      $('word-feedback').textContent = 'せいかい！';
      $('word-feedback').className = 'feedback correct';
      $('word-progress').style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

      setTimeout(() => {
        currentIndex++;
        isLocked = false;
        if (currentIndex >= TOTAL_QUESTIONS) {
          showResult();
        } else {
          showWordQuestion();
        }
      }, 3000);
    }
  } else {
    // Wrong character
    playWrongSE();
    // Briefly highlight current char as wrong
    const chars = $('word-input-display').querySelectorAll('.char');
    if (chars[wordTypedIndex]) {
      chars[wordTypedIndex].classList.add('wrong-char');
      chars[wordTypedIndex].classList.remove('current');
      setTimeout(() => {
        if (chars[wordTypedIndex]) {
          chars[wordTypedIndex].classList.remove('wrong-char');
          chars[wordTypedIndex].classList.add('current');
        }
      }, 300);
    }
  }
}

// ========== Result Screen ==========
function showResult() {
  stopBgm();
  playResultSE();
  showScreen('screen-result');

  $('result-correct').textContent = correctCount;

  // Stars based on score
  let stars = '';
  if (correctCount >= 9) stars = '⭐⭐⭐';
  else if (correctCount >= 7) stars = '⭐⭐';
  else if (correctCount >= 5) stars = '⭐';
  else stars = '💪';
  $('result-stars').textContent = stars;

  // Confetti for good scores
  if (correctCount >= 7) {
    spawnConfetti();
  }
}

function spawnConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a29bfe', '#fd79a8', '#00b894'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `-20px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
      el.style.width = `${8 + Math.random() * 10}px`;
      el.style.height = `${8 + Math.random() * 10}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * 50);
  }
}

// ========== Keyboard Listener ==========
document.addEventListener('keydown', (e) => {
  // Ignore modifier keys
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  const key = e.key.toLowerCase();

  // Only process single letter keys
  if (key.length !== 1 || !/[a-z]/.test(key)) return;

  e.preventDefault();
  resumeAudio();

  if (currentMode && currentMode.startsWith('key-') && $('screen-game-key').classList.contains('active')) {
    handleKeyInput(key);
  } else if (currentMode && currentMode.startsWith('word-') && $('screen-game-word').classList.contains('active')) {
    handleWordInput(key);
  }
});

// ========== Init ==========
showScreen('screen-title');
