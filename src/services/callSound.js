let callAudioContext = null;

const CALL_SOUND_NOTES = {
  connect: [
    { frequency: 480, offset: 0, duration: 0.2 },
    { frequency: 620, offset: 0, duration: 0.2 },
    { frequency: 480, offset: 0.3, duration: 0.2 },
    { frequency: 620, offset: 0.3, duration: 0.2 },
  ],
  hangup: [
    { frequency: 480, offset: 0, duration: 0.12 },
    { frequency: 360, offset: 0.16, duration: 0.16 },
  ],
};

function getCallAudioContext() {
  const AudioContextConstructor =
    window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!callAudioContext || callAudioContext.state === 'closed') {
    callAudioContext = new AudioContextConstructor();
  }
  return callAudioContext;
}

function playNotes(context, notes) {
  const startAt = context.currentTime + 0.02;

  notes.forEach(({ frequency, offset, duration }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = startAt + offset;
    const noteEnd = noteStart + duration;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.06, noteStart + 0.015);
    gain.gain.setValueAtTime(0.06, noteEnd - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  });
}

export function playCallSoundEffect(type) {
  if (typeof window === 'undefined') return;

  if (
    type === 'connect' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  ) {
    navigator.vibrate([150, 70, 150]);
  }

  const context = getCallAudioContext();
  if (!context) return;

  const notes = CALL_SOUND_NOTES[type];
  if (!notes) return;

  if (context.state === 'suspended') {
    context.resume().then(
      () => playNotes(context, notes),
      (error) => console.warn('Call sound could not start:', error)
    );
    return;
  }

  playNotes(context, notes);
}
