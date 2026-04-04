// Hiragana to romaji key mapping
export const HIRAGANA_MAP = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'k', 'き': 'k', 'く': 'k', 'け': 'k', 'こ': 'k',
  'さ': 's', 'し': 's', 'す': 's', 'せ': 's', 'そ': 's',
  'た': 't', 'ち': 't', 'つ': 't', 'て': 't', 'と': 't',
  'な': 'n', 'に': 'n', 'ぬ': 'n', 'ね': 'n', 'の': 'n',
  'は': 'h', 'ひ': 'h', 'ふ': 'h', 'へ': 'h', 'ほ': 'h',
  'ま': 'm', 'み': 'm', 'む': 'm', 'め': 'm', 'も': 'm',
  'や': 'y', 'ゆ': 'y', 'よ': 'y',
  'ら': 'r', 'り': 'r', 'る': 'r', 'れ': 'r', 'ろ': 'r',
  'わ': 'w', 'を': 'w', 'ん': 'n',
};

// Hiragana to full romaji for display hint
export const HIRAGANA_ROMAJI = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'hu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'nn',
};

// Alphabet list
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Japanese words with their romaji input
export const JAPANESE_WORDS = [
  { display: 'ねこ', romaji: 'neko', hint: 'neko' },
  { display: 'いぬ', romaji: 'inu', hint: 'inu' },
  { display: 'さくら', romaji: 'sakura', hint: 'sakura' },
  { display: 'りんご', romaji: 'ringo', hint: 'ringo' },
  { display: 'そら', romaji: 'sora', hint: 'sora' },
  { display: 'うみ', romaji: 'umi', hint: 'umi' },
  { display: 'やま', romaji: 'yama', hint: 'yama' },
  { display: 'はな', romaji: 'hana', hint: 'hana' },
  { display: 'ほし', romaji: 'hosi', hint: 'hosi' },
  { display: 'つき', romaji: 'tuki', hint: 'tuki' },
  { display: 'かぜ', romaji: 'kaze', hint: 'kaze' },
  { display: 'あめ', romaji: 'ame', hint: 'ame' },
  { display: 'ゆき', romaji: 'yuki', hint: 'yuki' },
  { display: 'すし', romaji: 'susi', hint: 'susi' },
  { display: 'たこ', romaji: 'tako', hint: 'tako' },
  { display: 'かめ', romaji: 'kame', hint: 'kame' },
  { display: 'とり', romaji: 'tori', hint: 'tori' },
  { display: 'さかな', romaji: 'sakana', hint: 'sakana' },
  { display: 'くるま', romaji: 'kuruma', hint: 'kuruma' },
  { display: 'おにぎり', romaji: 'onigiri', hint: 'onigiri' },
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
