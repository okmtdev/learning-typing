import {
  CODE_TO_KANA, KANA_TO_CODE, KANA_TO_KEY_LABEL,
  HIRAGANA_LIST, ALPHABET,
  JAPANESE_WORDS, ENGLISH_WORDS, shuffle,
} from './data.js';
import {
  playCorrectSE, playWrongSE, playTypeSE, playResultSE,
  playClickSE, playWordCompleteSE, startBgm, stopBgm, resumeAudio,
} from './audio.js';
import { addRecord, loadHistory, clearHistory, getModeName } from './history.js';

// ========== State ==========
let currentMode = null; // 'key-hiragana' | 'key-alphabet' | 'word-japanese' | 'word-english'
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let wordTypedIndex = 0;
let missCount = 0;
let isLocked = false;
let nextTimeout = null; // timeout ID for "せいかい" wait
let timerInterval = null;
let timerSeconds = 0;
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
    case 'show-history':
      showHistoryScreen();
      break;
    case 'clear-history':
      if (confirm('りれきをぜんぶけしますか？')) {
        clearHistory();
        showHistoryScreen();
      }
      break;
    case 'back-title':
      stopBgm();
      stopTimer();
      showScreen('screen-title');
      break;
  }
});

// ========== History Tab Filter ==========
let historyFilter = 'all';
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.history-tab');
  if (!tab) return;
  playClickSE();
  resumeAudio();
  historyFilter = tab.dataset.filter;
  document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  renderHistoryList();
  renderHistoryChart();
});

// ========== Timer ==========
function startTimer() {
  timerSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  const text = `${min}:${String(sec).padStart(2, '0')}`;
  const keyEl = $('key-timer');
  const wordEl = $('word-timer');
  if (keyEl) keyEl.textContent = text;
  if (wordEl) wordEl.textContent = text;
}

// ========== Key Typing Game ==========
function startKeyGame(mode) {
  currentMode = mode;
  currentIndex = 0;
  correctCount = 0;
  missCount = 0;
  isLocked = false;

  if (mode === 'key-hiragana') {
    // Filter to hiragana that have a JIS key mapping
    const available = HIRAGANA_LIST.filter(h => KANA_TO_CODE[h]);
    questions = shuffle(available).slice(0, TOTAL_QUESTIONS);
  } else {
    questions = shuffle(ALPHABET).slice(0, TOTAL_QUESTIONS);
  }

  showScreen('screen-game-key');
  startBgm();
  startTimer();
  showKeyQuestion();
}

function showKeyQuestion() {
  const q = questions[currentIndex];
  $('key-feedback').textContent = '';
  $('key-feedback').className = 'feedback';
  $('key-current').textContent = currentIndex + 1;
  $('key-progress').style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;

  if (currentMode === 'key-hiragana') {
    $('key-question').textContent = q;
    const keyLabel = KANA_TO_KEY_LABEL[q] || '?';
    $('key-hint').innerHTML = `キーボードの「<strong>${keyLabel}</strong>」キーをおしてね`;
  } else {
    // Show uppercase large + lowercase small for alphabet
    $('key-question').innerHTML = `<span>${q.toUpperCase()}</span><span class="key-question-lower">${q}</span>`;
    $('key-hint').innerHTML = `「<strong>${q.toUpperCase()}</strong>」をおしてね`;
  }
}

function handleKeyGameInput(code, key) {
  if (isLocked) return;

  const q = questions[currentIndex];
  let isCorrect = false;

  if (currentMode === 'key-hiragana') {
    // Accept: physical key code matches JIS layout, OR key event directly produces the hiragana
    const expectedCode = KANA_TO_CODE[q];
    isCorrect = (code === expectedCode) || (key === q);
  } else {
    // Alphabet mode: match the letter
    isCorrect = (key.toLowerCase() === q);
  }

  if (isCorrect) {
    isLocked = true;
    correctCount++;
    playCorrectSE();
    $('key-feedback').textContent = 'せいかい！';
    $('key-feedback').className = 'feedback correct';
    $('key-progress').style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

    nextTimeout = setTimeout(advanceNext, 3000);
  } else {
    missCount++;
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
  missCount = 0;
  wordTypedIndex = 0;
  isLocked = false;

  const wordList = mode === 'word-japanese' ? JAPANESE_WORDS : ENGLISH_WORDS;
  questions = shuffle(wordList).slice(0, TOTAL_QUESTIONS);

  showScreen('screen-game-word');
  startBgm();
  startTimer();
  showWordQuestion();
}

function showWordQuestion() {
  const q = questions[currentIndex];
  wordTypedIndex = 0;

  // Build display
  let hintText = '';
  if (currentMode === 'word-japanese') {
    // For Japanese words, show the key labels as hint
    const keyHints = q.chars.map(ch => KANA_TO_KEY_LABEL[ch] || '?').join(' ');
    hintText = `キー: ${keyHints}`;
  } else if (q.hint) {
    hintText = q.hint;
  }

  if (currentMode === 'word-english') {
    // Show uppercase prominently, lowercase below
    $('word-question').innerHTML = `
      <div class="word-upper">${q.display.toUpperCase()}</div>
      <div class="word-lower">${q.display}</div>
      <div style="font-size: 1.1rem; color: #999; margin-top: 8px;">${hintText}</div>
    `;
  } else {
    $('word-question').innerHTML = `
      <div>${q.display}</div>
      <div style="font-size: 1.1rem; color: #999; margin-top: 8px;">${hintText}</div>
    `;
  }

  $('word-feedback').textContent = '';
  $('word-feedback').className = 'feedback';
  $('word-current').textContent = currentIndex + 1;
  $('word-progress').style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;

  renderWordInput();
}

function renderWordInput() {
  const q = questions[currentIndex];
  let chars;
  if (currentMode === 'word-japanese') {
    chars = q.chars;
  } else {
    chars = q.romaji.split('');
  }

  let html = '';
  for (let i = 0; i < chars.length; i++) {
    let cls = 'char ';
    if (i < wordTypedIndex) {
      cls += 'typed';
    } else if (i === wordTypedIndex) {
      cls += 'current';
    } else {
      cls += 'remaining';
    }
    html += `<span class="${cls}">${chars[i]}</span>`;
  }

  $('word-input-display').innerHTML = html;
}

function handleWordGameInput(code, key) {
  if (isLocked) return;

  const q = questions[currentIndex];
  let isCorrect = false;
  let totalChars;

  if (currentMode === 'word-japanese') {
    // JIS kana direct input
    const expectedKana = q.chars[wordTypedIndex];
    const expectedCode = KANA_TO_CODE[expectedKana];
    isCorrect = (code === expectedCode) || (key === expectedKana);
    totalChars = q.chars.length;
  } else {
    // English word: match letter by letter
    const expected = q.romaji[wordTypedIndex];
    isCorrect = (key.toLowerCase() === expected);
    totalChars = q.romaji.length;
  }

  if (isCorrect) {
    playTypeSE();
    wordTypedIndex++;
    renderWordInput();

    if (wordTypedIndex >= totalChars) {
      // Word complete
      isLocked = true;
      correctCount++;
      playWordCompleteSE();
      $('word-feedback').textContent = 'せいかい！';
      $('word-feedback').className = 'feedback correct';
      $('word-progress').style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;

      nextTimeout = setTimeout(advanceNext, 3000);
    }
  } else {
    missCount++;
    playWrongSE();
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

// ========== Advance to Next (skip wait) ==========
function advanceNext() {
  if (!isLocked) return;
  if (nextTimeout) {
    clearTimeout(nextTimeout);
    nextTimeout = null;
  }
  currentIndex++;
  isLocked = false;
  if (currentIndex >= TOTAL_QUESTIONS) {
    stopTimer();
    showResult();
  } else if (currentMode && currentMode.startsWith('key-')) {
    showKeyQuestion();
  } else {
    showWordQuestion();
  }
}

// ========== Result Screen ==========
function showResult() {
  stopBgm();
  stopTimer();
  playResultSE();

  // Save to history
  addRecord(currentMode, correctCount, TOTAL_QUESTIONS, timerSeconds, missCount);

  showScreen('screen-result');

  $('result-correct').textContent = correctCount;

  // Show miss count
  $('result-miss').textContent = `ミス: ${missCount} かい`;

  // Show timer result
  const timerResult = $('result-timer');
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  timerResult.textContent = `タイム: ${min}:${String(sec).padStart(2, '0')}`;
  timerResult.style.display = 'block';

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

  const code = e.code;   // Physical key position (e.g., 'KeyA', 'Digit3')
  const key = e.key;     // Produced character (e.g., 'a', 'ち' in kana mode)

  // Enter key skips the "せいかい" wait
  if (key === 'Enter' && isLocked) {
    e.preventDefault();
    advanceNext();
    return;
  }

  // For hiragana modes: accept any physical key or kana character
  // For alphabet modes: only accept a-z
  const isKanaMode = currentMode === 'key-hiragana' || currentMode === 'word-japanese';

  if (!isKanaMode) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.length !== 1 || !/[a-z]/.test(lowerKey)) return;
  }

  e.preventDefault();
  resumeAudio();

  if ($('screen-game-key').classList.contains('active')) {
    handleKeyGameInput(code, key);
  } else if ($('screen-game-word').classList.contains('active')) {
    handleWordGameInput(code, key);
  }
});

// ========== History Screen ==========
function showHistoryScreen() {
  historyFilter = 'all';
  // Reset tab active state
  document.querySelectorAll('.history-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === 'all');
  });
  showScreen('screen-history');
  renderHistoryList();
  renderHistoryChart();
}

function getFilteredHistory() {
  const all = loadHistory();
  if (historyFilter === 'all') return all;
  return all.filter(r => r.mode === historyFilter);
}

function renderHistoryList() {
  const records = getFilteredHistory();
  const list = $('history-list');

  if (records.length === 0) {
    list.innerHTML = '<div class="history-empty">まだきろくがないよ</div>';
    return;
  }

  // Show newest first
  const sorted = [...records].reverse();
  list.innerHTML = sorted.map((r, i) => {
    const d = new Date(r.date);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const accuracy = `${r.correct}/${r.total}`;
    const misses = r.misses || 0;
    const timeStr = r.seconds > 0
      ? `${Math.floor(r.seconds / 60)}:${String(r.seconds % 60).padStart(2, '0')}`
      : '-';
    return `
      <div class="history-item">
        <div class="history-item-rank">${i + 1}</div>
        <div class="history-item-info">
          <div class="history-item-mode">${getModeName(r.mode)}</div>
          <div class="history-item-date">${dateStr}</div>
        </div>
        <div class="history-item-score">${accuracy}</div>
        <div class="history-item-miss">${misses > 0 ? 'ミス ' + misses : '-'}</div>
        <div class="history-item-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}

function renderHistoryChart() {
  const canvas = $('history-chart');
  const ctx = canvas.getContext('2d');
  const records = getFilteredHistory();

  // Use device pixel ratio for sharp rendering
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width - 32; // padding
  const h = 220;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  // Clear
  ctx.clearRect(0, 0, w, h);

  if (records.length < 1) {
    ctx.fillStyle = '#aaa';
    ctx.font = '700 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('まだデータがないよ', w / 2, h / 2);
    return;
  }

  // Take last 20 records
  const data = records.slice(-20);
  const padding = { top: 30, bottom: 32, left: 42, right: 42 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Compute max values for both axes
  const maxTime = Math.max(...data.map(r => r.seconds), 10);
  const maxMiss = Math.max(...data.map(r => r.misses || 0), 1);
  // Round up to nice numbers
  const timeAxis = ceilNice(maxTime);
  const missAxis = ceilNice(maxMiss);

  const GRID_LINES = 5;

  // Grid lines
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_LINES; i++) {
    const y = padding.top + chartH - (i / GRID_LINES) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
  }

  // Left Y axis labels (time - blue)
  ctx.fillStyle = '#4ecdc4';
  ctx.font = '600 10px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= GRID_LINES; i++) {
    const y = padding.top + chartH - (i / GRID_LINES) * chartH;
    const val = Math.round((i / GRID_LINES) * timeAxis);
    ctx.fillText(formatSec(val), padding.left - 6, y + 4);
  }

  // Right Y axis labels (miss - orange)
  ctx.fillStyle = '#e17055';
  ctx.textAlign = 'left';
  for (let i = 0; i <= GRID_LINES; i++) {
    const y = padding.top + chartH - (i / GRID_LINES) * chartH;
    const val = Math.round((i / GRID_LINES) * missAxis);
    ctx.fillText(String(val), w - padding.right + 6, y + 4);
  }

  // Axis titles
  ctx.font = '700 10px sans-serif';
  ctx.fillStyle = '#4ecdc4';
  ctx.textAlign = 'center';
  ctx.fillText('タイム', padding.left / 2, padding.top - 12);
  ctx.fillStyle = '#e17055';
  ctx.fillText('ミス', w - padding.right / 2, padding.top - 12);

  const stepX = data.length === 1 ? 0 : chartW / (data.length - 1);
  const getX = (i) => padding.left + (data.length === 1 ? chartW / 2 : i * stepX);

  // --- Draw time line (blue/teal) ---
  drawLine(ctx, data, getX, (r) => r.seconds / timeAxis, padding, chartH, '#4ecdc4', true);

  // --- Draw miss line (orange) ---
  drawLine(ctx, data, getX, (r) => (r.misses || 0) / missAxis, padding, chartH, '#e17055', false);

  // X axis labels (dates)
  ctx.fillStyle = '#aaa';
  ctx.font = '500 9px sans-serif';
  ctx.textAlign = 'center';
  const labelInterval = Math.max(1, Math.floor(data.length / 6));
  data.forEach((r, i) => {
    if (i % labelInterval === 0 || i === data.length - 1) {
      const x = getX(i);
      const d = new Date(r.date);
      ctx.fillText(`${d.getMonth() + 1}/${d.getDate()}`, x, h - 5);
    }
  });
}

function drawLine(ctx, data, getX, getRatio, padding, chartH, color, fill) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  data.forEach((r, i) => {
    const x = getX(i);
    const ratio = Math.min(getRatio(r), 1);
    const y = padding.top + chartH - ratio * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Fill area
  if (fill) {
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = color;
    ctx.lineTo(getX(data.length - 1), padding.top + chartH);
    ctx.lineTo(getX(0), padding.top + chartH);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Dots
  data.forEach((r, i) => {
    const x = getX(i);
    const ratio = Math.min(getRatio(r), 1);
    const y = padding.top + chartH - ratio * chartH;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function ceilNice(val) {
  if (val <= 5) return 5;
  if (val <= 10) return 10;
  if (val <= 30) return 30;
  if (val <= 60) return 60;
  if (val <= 120) return 120;
  if (val <= 180) return 180;
  return Math.ceil(val / 60) * 60;
}

function formatSec(s) {
  if (s < 60) return s + 'びょう';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec === 0 ? m + 'ふん' : `${m}:${String(sec).padStart(2, '0')}`;
}

// ========== Init ==========
showScreen('screen-title');
