import { useEffect, useRef } from 'react';

// ─── Synthesized Music Tracks (Web Audio API) ────────────────
// Each track is a function that creates a looping audio pattern
// using oscillators and gain nodes. Zero external files needed.

type TrackGenerator = (ctx: AudioContext, masterGain: GainNode) => (() => void);

function createLoFiBeat(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    // Mellow chord pad
    const notes = [261.63, 329.63, 392.0]; // C4, E4, G4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.05, now + 1.5);
      gain.gain.linearRampToValueAtTime(0, now + 2.8);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + i * 0.05);
      osc.stop(now + 3);
    });
    // Sub bass pulse
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(65.41, now); // C2
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    bassGain.gain.linearRampToValueAtTime(0, now + 1.0);
    bass.connect(bassGain);
    bassGain.connect(masterGain);
    bass.start(now);
    bass.stop(now + 1.2);

    setTimeout(loop, 3000);
  };
  loop();
  return () => { stopped = true; };
}

function createTechnoBeat(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 130; // BPM
  const beatDuration = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    
    for (let i = 0; i < 4; i++) {
      const t = now + i * beatDuration;
      // Kick drum (sine burst)
      const kick = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(150, t);
      kick.frequency.exponentialRampToValueAtTime(30, t + 0.15);
      kickGain.gain.setValueAtTime(0.25, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      kick.connect(kickGain);
      kickGain.connect(masterGain);
      kick.start(t);
      kick.stop(t + 0.25);

      // Hi-hat on offbeats
      if (i % 2 === 1) {
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * 0.3;
        }
        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        // High-pass filter for hat sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, t);
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.08, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start(t);
      }

      // Synth stab on beat 1 and 3
      if (i === 0 || i === 2) {
        const synth = ctx.createOscillator();
        const synthGain = ctx.createGain();
        synth.type = 'sawtooth';
        synth.frequency.setValueAtTime(i === 0 ? 110 : 130.81, t);
        synthGain.gain.setValueAtTime(0.04, t);
        synthGain.gain.linearRampToValueAtTime(0, t + beatDuration * 0.8);
        synth.connect(synthGain);
        synthGain.connect(masterGain);
        synth.start(t);
        synth.stop(t + beatDuration);
      }
    }
    setTimeout(loop, beatDuration * 4 * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createCinematicDrone(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const duration = 6;

    // Deep drone
    [55, 82.41, 110].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Slow LFO for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.3, now);
      lfoGain.gain.setValueAtTime(3, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + duration);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 1);
      gain.gain.linearRampToValueAtTime(0.04, now + duration - 1);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    // Atmospheric sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'triangle';
    sweep.frequency.setValueAtTime(200, now);
    sweep.frequency.linearRampToValueAtTime(800, now + duration);
    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.015, now + duration / 2);
    sweepGain.gain.linearRampToValueAtTime(0, now + duration);
    sweep.connect(sweepGain);
    sweepGain.connect(masterGain);
    sweep.start(now);
    sweep.stop(now + duration + 0.1);

    setTimeout(loop, duration * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createAmbientPad(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const chords = [
    [220, 277.18, 329.63],    // Am
    [196, 246.94, 293.66],    // G
    [174.61, 220, 261.63],    // F
    [164.81, 207.65, 246.94], // E
  ];
  let chordIndex = 0;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const duration = 4;
    const chord = chords[chordIndex % chords.length];
    chordIndex++;

    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.8);
      gain.gain.setValueAtTime(0.05, now + duration - 1);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.1);

      // Octave higher, quieter
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.015, now + 1);
      gain2.gain.linearRampToValueAtTime(0, now + duration);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + duration + 0.1);
    });

    setTimeout(loop, duration * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createUpbeatPop(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 120;
  const beatDuration = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beatDuration * 4;

    for (let i = 0; i < 8; i++) {
      const t = now + i * beatDuration * 0.5;
      // Kick on quarter notes
      if (i % 2 === 0) {
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(120, t);
        kick.frequency.exponentialRampToValueAtTime(40, t + 0.12);
        kickGain.gain.setValueAtTime(0.2, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        kick.connect(kickGain);
        kickGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.2);
      }
      // Snare on 2 and 4
      if (i === 2 || i === 6) {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * 0.4;
        }
        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, t);
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.12, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start(t);
      }
      // Melodic pluck on 8th notes
      const pluck = ctx.createOscillator();
      const pluckGain = ctx.createGain();
      const notes = [523.25, 587.33, 659.25, 523.25, 783.99, 659.25, 587.33, 523.25];
      pluck.type = 'triangle';
      pluck.frequency.setValueAtTime(notes[i], t);
      pluckGain.gain.setValueAtTime(0.06, t);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      pluck.connect(pluckGain);
      pluckGain.connect(masterGain);
      pluck.start(t);
      pluck.stop(t + 0.25);
    }
    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createChillwave(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const duration = 5;

    // Warm pad with detuned oscillators
    [329.63, 392, 493.88].forEach((freq, i) => {
      for (let d = -5; d <= 5; d += 5) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + d, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.5 + i * 0.2);
        gain.gain.setValueAtTime(0.03, now + duration - 1.5);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.1);
      }
    });

    // Gentle sub bass
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(82.41, now);
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    subGain.gain.linearRampToValueAtTime(0, now + 2);
    sub.connect(subGain);
    subGain.connect(masterGain);
    sub.start(now);
    sub.stop(now + 2.5);

    setTimeout(loop, duration * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── Track Registry ──────────────────────────────────────────

const TRACK_GENERATORS: Record<string, TrackGenerator> = {
  techno: createTechnoBeat,
  lofi: createLoFiBeat,
  cinematic: createCinematicDrone,
  ambient: createAmbientPad,
  upbeat: createUpbeatPop,
  pop: createChillwave,
};

export const MUSIC_TRACKS = {
  none:      { name: 'No Music' },
  techno:    { name: 'Techno Beat' },
  lofi:      { name: 'Lo-Fi Chill' },
  cinematic: { name: 'Cinematic Drone' },
  upbeat:    { name: 'Upbeat Pop' },
  ambient:   { name: 'Ambient Pad' },
  pop:       { name: 'Chillwave' },
};

// ─── Component ───────────────────────────────────────────────

interface BackgroundMusicProps {
  trackId: keyof typeof MUSIC_TRACKS;
  isPlaying: boolean;
  volume?: number;
}

export default function BackgroundMusic({ trackId, isPlaying, volume = 0.5 }: BackgroundMusicProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);
  const activeTrackRef = useRef<string>('none');

  useEffect(() => {
    // Track if this effect instance has been cleaned up
    let cancelled = false;

    // Stop any currently playing track
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }

    // Close old context if track changed
    if (activeTrackRef.current !== trackId && ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
      masterGainRef.current = null;
    }

    activeTrackRef.current = trackId;

    if (trackId === 'none' || !isPlaying) {
      return;
    }

    const generator = TRACK_GENERATORS[trackId];
    if (!generator) return;

    // Create audio context on user gesture (play click)
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    ctxRef.current = ctx;
    masterGainRef.current = masterGain;

    // Resume context (required for Chrome autoplay policy)
    ctx.resume().then(() => {
      // Guard: if effect was cleaned up while waiting for resume, don't start
      if (cancelled) {
        ctx.close().catch(() => {});
        return;
      }
      if (activeTrackRef.current === trackId) {
        stopFnRef.current = generator(ctx, masterGain);
      }
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (stopFnRef.current) {
        stopFnRef.current();
        stopFnRef.current = null;
      }
      // Only close context if it's still the current one
      if (ctxRef.current === ctx) {
        ctx.close().catch(() => {});
        ctxRef.current = null;
        masterGainRef.current = null;
      }
    };
  }, [trackId, isPlaying]);

  // Update volume in real-time without restarting the track
  useEffect(() => {
    if (masterGainRef.current && ctxRef.current && ctxRef.current.state === 'running') {
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume, 
        ctxRef.current.currentTime + 0.1
      );
    }
  }, [volume]);

  return null;
}
