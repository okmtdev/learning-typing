// ========== JIS Kana Keyboard Layout ==========
// Maps physical key codes (KeyboardEvent.code) to JIS hiragana characters

export const CODE_TO_KANA = {
  // Number row
  'Digit1': 'ぬ', 'Digit2': 'ふ', 'Digit3': 'あ', 'Digit4': 'う', 'Digit5': 'え',
  'Digit6': 'お', 'Digit7': 'や', 'Digit8': 'ゆ', 'Digit9': 'よ', 'Digit0': 'わ',
  'Minus': 'ほ', 'Equal': 'へ',
  // Top letter row
  'KeyQ': 'た', 'KeyW': 'て', 'KeyE': 'い', 'KeyR': 'す', 'KeyT': 'か',
  'KeyY': 'ん', 'KeyU': 'な', 'KeyI': 'に', 'KeyO': 'ら', 'KeyP': 'せ',
  // Home row
  'KeyA': 'ち', 'KeyS': 'と', 'KeyD': 'し', 'KeyF': 'は', 'KeyG': 'き',
  'KeyH': 'く', 'KeyJ': 'ま', 'KeyK': 'の', 'KeyL': 'り',
  'Semicolon': 'れ', 'Quote': 'け',
  // Bottom row
  'KeyZ': 'つ', 'KeyX': 'さ', 'KeyC': 'そ', 'KeyV': 'ひ', 'KeyB': 'こ',
  'KeyN': 'み', 'KeyM': 'も',
  'Comma': 'ね', 'Period': 'る', 'Slash': 'め',
  'IntlRo': 'ろ',
  // Backslash position (む)
  'Backslash': 'む', 'IntlYen': 'ー',
};

// Reverse mapping: hiragana -> physical key code
export const KANA_TO_CODE = {};
for (const [code, kana] of Object.entries(CODE_TO_KANA)) {
  KANA_TO_CODE[kana] = code;
}

// Reverse mapping: hiragana -> the alphabet label on that physical key
export const KANA_TO_KEY_LABEL = {
  'ぬ': '1', 'ふ': '2', 'あ': '3', 'う': '4', 'え': '5',
  'お': '6', 'や': '7', 'ゆ': '8', 'よ': '9', 'わ': '0',
  'ほ': '-', 'へ': '=',
  'た': 'Q', 'て': 'W', 'い': 'E', 'す': 'R', 'か': 'T',
  'ん': 'Y', 'な': 'U', 'に': 'I', 'ら': 'O', 'せ': 'P',
  'ち': 'A', 'と': 'S', 'し': 'D', 'は': 'F', 'き': 'G',
  'く': 'H', 'ま': 'J', 'の': 'K', 'り': 'L',
  'れ': ';', 'け': "'",
  'つ': 'Z', 'さ': 'X', 'そ': 'C', 'ひ': 'V', 'こ': 'B',
  'み': 'N', 'も': 'M',
  'ね': ',', 'る': '.', 'め': '/', 'ろ': '\\',
  'む': ']',
};

// Hiragana list for key typing game (common ones that are on JIS keyboard)
export const HIRAGANA_LIST = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'ん',
];

// Alphabet list
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Japanese words for kana direct input (each char is typed individually on JIS keyboard)
export const JAPANESE_WORDS = [
  { display: 'ねこ', chars: ['ね', 'こ'] },
  { display: 'いぬ', chars: ['い', 'ぬ'] },
  { display: 'そら', chars: ['そ', 'ら'] },
  { display: 'うみ', chars: ['う', 'み'] },
  { display: 'やま', chars: ['や', 'ま'] },
  { display: 'はな', chars: ['は', 'な'] },
  { display: 'ほし', chars: ['ほ', 'し'] },
  { display: 'つき', chars: ['つ', 'き'] },
  { display: 'かさ', chars: ['か', 'さ'] },
  { display: 'あめ', chars: ['あ', 'め'] },
  { display: 'ゆき', chars: ['ゆ', 'き'] },
  { display: 'すし', chars: ['す', 'し'] },
  { display: 'たこ', chars: ['た', 'こ'] },
  { display: 'かめ', chars: ['か', 'め'] },
  { display: 'とり', chars: ['と', 'り'] },
  { display: 'さくら', chars: ['さ', 'く', 'ら'] },
  { display: 'くるま', chars: ['く', 'る', 'ま'] },
  { display: 'ふね', chars: ['ふ', 'ね'] },
  { display: 'みかん', chars: ['み', 'か', 'ん'] },
  { display: 'にしき', chars: ['に', 'し', 'き'] },
  { display: 'まつり', chars: ['ま', 'つ', 'り'] },
  { display: 'なつ', chars: ['な', 'つ'] },
];

// English words for kids
export const ENGLISH_WORDS = [
  { display: 'cat', romaji: 'cat', hint: 'ねこ' },
  { display: 'dog', romaji: 'dog', hint: 'いぬ' },
  { display: 'sun', romaji: 'sun', hint: 'たいよう' },
  { display: 'moon', romaji: 'moon', hint: 'つき' },
  { display: 'star', romaji: 'star', hint: 'ほし' },
  { display: 'fish', romaji: 'fish', hint: 'さかな' },
  { display: 'bird', romaji: 'bird', hint: 'とり' },
  { display: 'tree', romaji: 'tree', hint: 'き' },
  { display: 'rain', romaji: 'rain', hint: 'あめ' },
  { display: 'snow', romaji: 'snow', hint: 'ゆき' },
  { display: 'apple', romaji: 'apple', hint: 'りんご' },
  { display: 'cake', romaji: 'cake', hint: 'ケーキ' },
  { display: 'milk', romaji: 'milk', hint: 'ぎゅうにゅう' },
  { display: 'book', romaji: 'book', hint: 'ほん' },
  { display: 'hand', romaji: 'hand', hint: 'て' },
  { display: 'rice', romaji: 'rice', hint: 'ごはん' },
  { display: 'bear', romaji: 'bear', hint: 'くま' },
  { display: 'frog', romaji: 'frog', hint: 'かえる' },
  { display: 'pink', romaji: 'pink', hint: 'ピンク' },
  { display: 'blue', romaji: 'blue', hint: 'あお' },
];

// Shuffle array utility
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
