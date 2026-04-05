// ========== History Storage (localStorage) ==========

const STORAGE_KEY = 'typing-game-history';
const MAX_RECORDS = 100;

// Mode label map
const MODE_LABELS = {
  'key-hiragana': 'キー・ひらがな',
  'key-alphabet': 'キー・えいじ',
  'word-japanese': 'たんご・ひらがな',
  'word-english': 'たんご・えいじ',
};

export function getModeName(mode) {
  return MODE_LABELS[mode] || mode;
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Save a game result.
 * @param {string} mode - 'key-hiragana' | 'key-alphabet' | 'word-japanese' | 'word-english'
 * @param {number} correct - number of correct answers
 * @param {number} total - total questions
 * @param {number} seconds - time in seconds
 * @param {number} misses - number of typo misses
 */
export function addRecord(mode, correct, total, seconds, misses) {
  const records = loadHistory();
  records.push({
    mode,
    correct,
    total,
    seconds,
    misses: misses || 0,
    date: new Date().toISOString(),
  });
  // Keep only latest MAX_RECORDS
  if (records.length > MAX_RECORDS) {
    records.splice(0, records.length - MAX_RECORDS);
  }
  saveHistory(records);
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
