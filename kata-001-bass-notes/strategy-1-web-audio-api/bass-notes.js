function getAudioContext() {
  if (!window.audioCtx) {
    // Webkit check is for legacy browsers
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioCtx = new AudioContext();
  }
  return window.audioCtx;
}

function noteToFrequency(startingNote, distanceFromStart) {
  const STARTING_NOTE_FREQUENCY_MAP = {
    'g2': 98.00,
    'd2': 73.42,
    'a1': 55.00,
    'e1': 41.20,
  };

  const startingFrequency = STARTING_NOTE_FREQUENCY_MAP[startingNote];
  return startingFrequency * (2.0 ** (distanceFromStart / 12));
}

function getSineWaveSource(frequency) {
  const context = getAudioContext();
  const sineWaveSource = new OscillatorNode(context, { frequency });
  const gain = new GainNode(context, { gain: 5 });
  // Connect source to gain, and gain to destination
  sineWaveSource.connect(gain).connect(context.destination);
  return sineWaveSource;
}

function resumeAutoplay() {
  // Check if context is in suspended state (autoplay policy)
  const context = getAudioContext();
  if (context.state === 'suspended') {
    context.resume();
  }
}

function setSource(startingNote, distanceFromStart, source) {
  if (!window.notes) { window.notes = {} };
  if (!window.notes[startingNote]) { window.notes[startingNote] = {} };
  window.notes[startingNote][distanceFromStart] = source;
}

function getSourceFromWindow(startingNote, distanceFromStart) {
  return window.notes[startingNote][distanceFromStart];
}

function toggleNote(element, startingNote, distanceFromStart = 0) {
  resumeAutoplay();

  if (element.dataset.playing === 'false') {
    const frequency = noteToFrequency(startingNote, distanceFromStart);
    const source = getSineWaveSource(frequency);
    source.start();
    setSource(startingNote, distanceFromStart, source);
    element.dataset.playing = 'true';
  }

  else if (element.dataset.playing === 'true') {
    const source = getSourceFromWindow(startingNote, distanceFromStart);
    source.stop();
    setSource(startingNote, distanceFromStart, undefined);
    element.dataset.playing = 'false';
  }
}
