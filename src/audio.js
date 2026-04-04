// Web Audio API based BGM and SE generator (no external audio files needed)

let audioCtx = null;
let bgmInterval = null;
let bgmGain = null;
let isBgmPlaying = false;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// ========== Sound Effects ==========

export function playCorrectSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Happy ascending chime
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.4);
  });
}

export function playWrongSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Low buzzer
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 150;
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

export function playTypeSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 800 + Math.random() * 200;
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

export function playResultSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Fanfare
  const melody = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 659.25, time: 0.15, dur: 0.15 },
    { freq: 783.99, time: 0.3, dur: 0.15 },
    { freq: 1046.5, time: 0.5, dur: 0.5 },
  ];

  melody.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, now + time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + dur);
  });
}

export function playClickSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

export function playWordCompleteSE() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  // Quick ascending arpeggio
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.3);
  });
}

// ========== BGM ==========

const BGM_NOTES = [
  // Simple happy melody loop (C major pentatonic)
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 587.33, dur: 0.25 }, // D5
  { freq: 659.25, dur: 0.25 }, // E5
  { freq: 783.99, dur: 0.5 },  // G5
  { freq: 659.25, dur: 0.25 }, // E5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 587.33, dur: 0.5 },  // D5
  { freq: 0, dur: 0.25 },      // rest
  { freq: 783.99, dur: 0.25 }, // G5
  { freq: 659.25, dur: 0.25 }, // E5
  { freq: 587.33, dur: 0.25 }, // D5
  { freq: 523.25, dur: 0.5 },  // C5
  { freq: 0, dur: 0.5 },       // rest
];

function playBgmLoop() {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  bgmGain = ctx.createGain();
  bgmGain.gain.value = 0.06;
  bgmGain.connect(ctx.destination);

  let offset = 0;
  BGM_NOTES.forEach(({ freq, dur }) => {
    if (freq > 0) {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      noteGain.gain.setValueAtTime(1, now + offset);
      noteGain.gain.exponentialRampToValueAtTime(0.3, now + offset + dur * 0.8);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);
      osc.connect(noteGain);
      noteGain.connect(bgmGain);
      osc.start(now + offset);
      osc.stop(now + offset + dur);
    }
    offset += dur;
  });

  return offset * 1000;
}

export function startBgm() {
  if (isBgmPlaying) return;
  isBgmPlaying = true;

  const loopDuration = playBgmLoop();
  bgmInterval = setInterval(() => {
    if (isBgmPlaying) {
      playBgmLoop();
    }
  }, loopDuration);
}

export function stopBgm() {
  isBgmPlaying = false;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

// Resume audio context on user interaction
export function resumeAudio() {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}
