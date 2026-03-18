// Programmatic sound effects using Web Audio API — no MP3 files needed!

let audioCtx = null;
let soundEnabled = true;

const getCtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};

const playTone = ({ frequency = 440, type = 'sine', duration = 0.15, volume = 0.2, startFreq, endFreq, delay = 0 }) => {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    const start = ctx.currentTime + delay;

    if (startFreq && endFreq) {
      oscillator.frequency.setValueAtTime(startFreq, start);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    } else {
      oscillator.frequency.setValueAtTime(frequency, start);
    }

    gainNode.gain.setValueAtTime(volume, start);
    gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  } catch (e) {
    // silently fail if audio not available
  }
};

export const sounds = {
  click: () => {
    playTone({ frequency: 600, type: 'sine', duration: 0.08, volume: 0.15 });
  },

  start: () => {
    // Ascending whoosh
    playTone({ startFreq: 300, endFreq: 800, type: 'sine', duration: 0.25, volume: 0.2 });
    playTone({ startFreq: 400, endFreq: 900, type: 'triangle', duration: 0.3, volume: 0.1, delay: 0.1 });
  },

  turn: () => {
    // Two-note ping
    playTone({ frequency: 660, type: 'sine', duration: 0.1, volume: 0.15 });
    playTone({ frequency: 880, type: 'sine', duration: 0.1, volume: 0.15, delay: 0.12 });
  },

  vote: () => {
    // Soft low thud
    playTone({ startFreq: 220, endFreq: 110, type: 'sine', duration: 0.2, volume: 0.2 });
  },

  result: () => {
    // Triumphant chord
    playTone({ frequency: 523, type: 'sine', duration: 0.4, volume: 0.15 });
    playTone({ frequency: 659, type: 'sine', duration: 0.4, volume: 0.12, delay: 0.05 });
    playTone({ frequency: 784, type: 'sine', duration: 0.5, volume: 0.1, delay: 0.12 });
  },

  error: () => {
    playTone({ startFreq: 300, endFreq: 200, type: 'sawtooth', duration: 0.15, volume: 0.1 });
  },

  join: () => {
    playTone({ frequency: 440, type: 'sine', duration: 0.1, volume: 0.12 });
    playTone({ frequency: 550, type: 'sine', duration: 0.12, volume: 0.12, delay: 0.1 });
  },
};

export const setSoundEnabled = (val) => { soundEnabled = val; };
export const isSoundEnabled = () => soundEnabled;
