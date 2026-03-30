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

// ─── New Tracks ──────────────────────────────────────────────

function createEpicDrums(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 140;
  const beat = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    // 8-beat pattern (2 bars)
    for (let i = 0; i < 8; i++) {
      const t = now + i * beat;

      // Heavy kick on 1, 5
      if (i === 0 || i === 4) {
        const kick = ctx.createOscillator();
        const kg = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(180, t);
        kick.frequency.exponentialRampToValueAtTime(25, t + 0.25);
        kg.gain.setValueAtTime(0.5, t);
        kg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        kick.connect(kg); kg.connect(masterGain);
        kick.start(t); kick.stop(t + 0.3);
      }

      // Snare on 3, 7
      if (i === 2 || i === 6) {
        const sz = ctx.sampleRate * 0.12;
        const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
        const src = ctx.createBufferSource();
        const sg = ctx.createGain();
        const flt = ctx.createBiquadFilter();
        flt.type = 'bandpass'; flt.frequency.value = 2500; flt.Q.value = 0.7;
        src.buffer = buf;
        sg.gain.setValueAtTime(0.22, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        src.connect(flt); flt.connect(sg); sg.connect(masterGain);
        src.start(t);
      }

      // Crash on beat 1
      if (i === 0) {
        const csz = ctx.sampleRate * 0.4;
        const cbuf = ctx.createBuffer(1, csz, ctx.sampleRate);
        const cd = cbuf.getChannelData(0);
        for (let j = 0; j < csz; j++) cd[j] = (Math.random() * 2 - 1);
        const csrc = ctx.createBufferSource();
        const cg = ctx.createGain();
        const cflt = ctx.createBiquadFilter();
        cflt.type = 'highpass'; cflt.frequency.value = 6000;
        csrc.buffer = cbuf;
        cg.gain.setValueAtTime(0.1, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        csrc.connect(cflt); cflt.connect(cg); cg.connect(masterGain);
        csrc.start(t);
      }

      // Offbeat hi-hats
      if (i % 2 === 1) {
        const hsz = ctx.sampleRate * 0.04;
        const hbuf = ctx.createBuffer(1, hsz, ctx.sampleRate);
        const hd = hbuf.getChannelData(0);
        for (let j = 0; j < hsz; j++) hd[j] = (Math.random() * 2 - 1) * 0.5;
        const hsrc = ctx.createBufferSource();
        const hg = ctx.createGain();
        const hflt = ctx.createBiquadFilter();
        hflt.type = 'highpass'; hflt.frequency.value = 9000;
        hsrc.buffer = hbuf;
        hg.gain.setValueAtTime(0.07, t); hg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        hsrc.connect(hflt); hflt.connect(hg); hg.connect(masterGain);
        hsrc.start(t);
      }
    }
    setTimeout(loop, beat * 8 * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createDarkTrap(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 75; // Slow trap tempo
  const beat = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const t = now + i * beat;

      // 808 sub bass kick
      if (i === 0 || i === 2) {
        const k = ctx.createOscillator();
        const kg = ctx.createGain();
        k.type = 'sine';
        k.frequency.setValueAtTime(60, t);
        k.frequency.exponentialRampToValueAtTime(28, t + 0.5);
        kg.gain.setValueAtTime(0.45, t);
        kg.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        k.connect(kg); kg.connect(masterGain);
        k.start(t); k.stop(t + 0.6);
      }

      // Rapid hi-hats (trap roll on beat 3)
      const hatSteps = i === 2 ? 6 : 1;
      for (let h = 0; h < hatSteps; h++) {
        const ht = t + h * (beat / hatSteps) * 0.5;
        const hsz = ctx.sampleRate * 0.03;
        const hbuf = ctx.createBuffer(1, hsz, ctx.sampleRate);
        const hd = hbuf.getChannelData(0);
        for (let j = 0; j < hsz; j++) hd[j] = (Math.random() * 2 - 1);
        const hsrc = ctx.createBufferSource();
        const hg = ctx.createGain();
        const hflt = ctx.createBiquadFilter();
        hflt.type = 'highpass'; hflt.frequency.value = 10000;
        hsrc.buffer = hbuf;
        hg.gain.setValueAtTime(0.06 / (h + 1), ht); hg.gain.exponentialRampToValueAtTime(0.001, ht + 0.025);
        hsrc.connect(hflt); hflt.connect(hg); hg.connect(masterGain);
        hsrc.start(ht);
      }
    }

    // Dark synth stab melody
    const melody = [55, 0, 65.41, 0, 49, 0, 41.2, 55];
    melody.forEach((freq, i) => {
      if (freq === 0) return;
      const t = now + i * (beat * 0.5);
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      og.gain.setValueAtTime(0.05, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(og); og.connect(masterGain);
      osc.start(t); osc.stop(t + 0.35);
    });

    setTimeout(loop, beat * 4 * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createRetroSynthwave(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 100;
  const beat = 60 / tempo;

  // Classic minor pentatonic arpeggio in A minor
  const arpNotes = [220, 261.63, 293.66, 349.23, 392, 349.23, 293.66, 261.63];

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 8;

    // Arpeggio
    arpNotes.forEach((freq, i) => {
      const t = now + i * (beat * 0.5);
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      og.gain.setValueAtTime(0.05, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(og); og.connect(masterGain);
      osc.start(t); osc.stop(t + 0.35);
    });

    // Warm bass line
    const bassNotes = [110, 110, 130.81, 146.83];
    bassNotes.forEach((freq, i) => {
      const t = now + i * beat * 2;
      const b = ctx.createOscillator();
      const bg = ctx.createGain();
      b.type = 'triangle';
      b.frequency.setValueAtTime(freq, t);
      bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(0.14, t + 0.1); bg.gain.linearRampToValueAtTime(0, t + beat * 1.8);
      b.connect(bg); bg.connect(masterGain);
      b.start(t); b.stop(t + beat * 2);
    });

    // Drum machine
    for (let i = 0; i < 8; i++) {
      const t = now + i * beat;
      if (i % 2 === 0) {
        const k = ctx.createOscillator(); const kg = ctx.createGain();
        k.type = 'sine'; k.frequency.setValueAtTime(140, t); k.frequency.exponentialRampToValueAtTime(35, t + 0.18);
        kg.gain.setValueAtTime(0.28, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.22);
      }
      if (i === 2 || i === 6) {
        const ssz = ctx.sampleRate * 0.1; const sbuf = ctx.createBuffer(1, ssz, ctx.sampleRate);
        const sd = sbuf.getChannelData(0); for (let j = 0; j < ssz; j++) sd[j] = (Math.random() * 2 - 1);
        const ssrc = ctx.createBufferSource(); const sg = ctx.createGain(); const sflt = ctx.createBiquadFilter();
        sflt.type = 'bandpass'; sflt.frequency.value = 3500;
        ssrc.buffer = sbuf; sg.gain.setValueAtTime(0.15, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        ssrc.connect(sflt); sflt.connect(sg); sg.connect(masterGain); ssrc.start(t);
      }
    }

    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createHorrorSuspense(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const duration = 8;

    // Dissonant tritone cluster
    [196, 277.18, 369.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      // Slight random detune for unease
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq + (i * 0.5), now);
      osc.frequency.linearRampToValueAtTime(freq - (i * 0.8), now + duration);
      og.gain.setValueAtTime(0, now);
      og.gain.linearRampToValueAtTime(0.04, now + 1.5);
      og.gain.setValueAtTime(0.04, now + duration - 2);
      og.gain.linearRampToValueAtTime(0, now + duration);
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 800;
      osc.connect(flt); flt.connect(og); og.connect(masterGain);
      osc.start(now); osc.stop(now + duration + 0.1);
    });

    // Low rumble
    const rumble = ctx.createOscillator();
    const rg = ctx.createGain();
    rumble.type = 'sine';
    rumble.frequency.setValueAtTime(28, now);
    rg.gain.setValueAtTime(0, now); rg.gain.linearRampToValueAtTime(0.3, now + 2); rg.gain.setValueAtTime(0.3, now + 5); rg.gain.linearRampToValueAtTime(0, now + duration);
    rumble.connect(rg); rg.connect(masterGain); rumble.start(now); rumble.stop(now + duration + 0.1);

    // Random scratchy noise bursts
    for (let s = 0; s < 3; s++) {
      const st = now + 2 + s * 2.5;
      const ssz = ctx.sampleRate * 0.15;
      const sbuf = ctx.createBuffer(1, ssz, ctx.sampleRate);
      const sdata = sbuf.getChannelData(0);
      for (let j = 0; j < ssz; j++) sdata[j] = (Math.random() * 2 - 1) * 0.3;
      const ssrc = ctx.createBufferSource(); const sg = ctx.createGain();
      ssrc.buffer = sbuf; sg.gain.setValueAtTime(0.06, st); sg.gain.exponentialRampToValueAtTime(0.001, st + 0.12);
      ssrc.connect(sg); sg.connect(masterGain); ssrc.start(st);
    }

    setTimeout(loop, duration * 1000);
  };
  loop();
  return () => { stopped = true; };
}

function createMotivationalBuild(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  let phase = 0;
  const tempo = 110;
  const beat = 60 / tempo;

  // Rising chord progression: C → Am → F → G
  const chords = [
    [261.63, 329.63, 392],        // C major
    [220, 261.63, 329.63, 440],   // Am
    [174.61, 220, 261.63, 349.23],// F major
    [196, 246.94, 293.66, 392],   // G major
  ];

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;
    const chord = chords[phase % chords.length];
    const intensity = Math.min(1, 0.4 + phase * 0.08); // builds over time

    // Pad chord
    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      og.gain.setValueAtTime(0, now);
      og.gain.linearRampToValueAtTime(0.04 * intensity, now + 0.3);
      og.gain.setValueAtTime(0.04 * intensity, now + barLen - 0.4);
      og.gain.linearRampToValueAtTime(0, now + barLen);
      osc.connect(og); og.connect(masterGain); osc.start(now); osc.stop(now + barLen + 0.1);
    });

    // Kick builds in later phases
    if (phase >= 2) {
      for (let i = 0; i < 4; i++) {
        const t = now + i * beat;
        const k = ctx.createOscillator(); const kg = ctx.createGain();
        k.type = 'sine'; k.frequency.setValueAtTime(140, t); k.frequency.exponentialRampToValueAtTime(40, t + 0.18);
        kg.gain.setValueAtTime(0.28 * intensity, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.22);
      }
    }

    // Melodic rise note on each chord change
    const riseFreq = chord[chord.length - 1] * (1 + phase * 0.05);
    const rise = ctx.createOscillator(); const rg = ctx.createGain();
    rise.type = 'sine';
    rise.frequency.setValueAtTime(riseFreq, now);
    rg.gain.setValueAtTime(0, now); rg.gain.linearRampToValueAtTime(0.06 * intensity, now + 0.2); rg.gain.linearRampToValueAtTime(0, now + barLen);
    rise.connect(rg); rg.connect(masterGain); rise.start(now); rise.stop(now + barLen + 0.1);

    phase++;
    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; phase = 0; };
}

function createLinkedInPro(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 115; // Corporate upbeat
  const beat = 60 / tempo;

  // C major scale melody — bright, confident, professional
  // Inspired by LinkedIn Learning / TEDx intro feel
  const melody = [
    523.25, 659.25, 783.99, 659.25,  // C5 E5 G5 E5
    587.33, 698.46, 880.00, 698.46,  // D5 F5 A5 F5
    523.25, 659.25, 783.99, 1046.5,  // C5 E5 G5 C6 (rise)
    880.00, 783.99, 698.46, 523.25,  // A5 G5 F5 C5 (resolve)
  ];

  // Bass: root notes on 1 and 3
  const bassNotes = [130.81, 130.81, 146.83, 146.83]; // C3 C3 D3 D3

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;

    // --- Kick drum on beats 1 & 3 ---
    [0, 2].forEach(b => {
      const t = now + b * beat;
      const k = ctx.createOscillator(); const kg = ctx.createGain();
      k.type = 'sine';
      k.frequency.setValueAtTime(160, t); k.frequency.exponentialRampToValueAtTime(30, t + 0.2);
      kg.gain.setValueAtTime(0.35, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.25);
    });

    // --- Snare on beats 2 & 4 (light crisp snare) ---
    [1, 3].forEach(b => {
      const t = now + b * beat;
      const sz = ctx.sampleRate * 0.08;
      const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource(); const sg = ctx.createGain(); const flt = ctx.createBiquadFilter();
      flt.type = 'bandpass'; flt.frequency.value = 3200; flt.Q.value = 0.8;
      src.buffer = buf;
      sg.gain.setValueAtTime(0.14, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      src.connect(flt); flt.connect(sg); sg.connect(masterGain); src.start(t);
    });

    // --- 8th note hi-hats (tight, professional) ---
    for (let h = 0; h < 8; h++) {
      const t = now + h * (beat * 0.5);
      const hsz = ctx.sampleRate * 0.025;
      const hbuf = ctx.createBuffer(1, hsz, ctx.sampleRate);
      const hd = hbuf.getChannelData(0);
      for (let j = 0; j < hsz; j++) hd[j] = (Math.random() * 2 - 1);
      const hsrc = ctx.createBufferSource(); const hg = ctx.createGain(); const hflt = ctx.createBiquadFilter();
      hflt.type = 'highpass'; hflt.frequency.value = 9500;
      hsrc.buffer = hbuf;
      // Accent downbeats slightly
      const vol = h % 2 === 0 ? 0.055 : 0.032;
      hg.gain.setValueAtTime(vol, t); hg.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
      hsrc.connect(hflt); hflt.connect(hg); hg.connect(masterGain); hsrc.start(t);
    }

    // --- Bass pulse (clean sine, punchy) ---
    bassNotes.forEach((freq, i) => {
      const t = now + i * beat;
      const b = ctx.createOscillator(); const bg = ctx.createGain();
      b.type = 'sine';
      b.frequency.setValueAtTime(freq, t);
      bg.gain.setValueAtTime(0, t);
      bg.gain.linearRampToValueAtTime(0.18, t + 0.03);
      bg.gain.linearRampToValueAtTime(0.10, t + beat * 0.6);
      bg.gain.linearRampToValueAtTime(0, t + beat * 0.9);
      b.connect(bg); bg.connect(masterGain); b.start(t); b.stop(t + beat + 0.1);
    });

    // --- Pluck melody (triangle wave, bright & clean) ---
    melody.forEach((freq, i) => {
      const t = now + i * (beat * 0.25);
      if (t >= now + barLen) return;
      const osc = ctx.createOscillator(); const og = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      og.gain.setValueAtTime(0.07, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(og); og.connect(masterGain); osc.start(t); osc.stop(t + 0.25);
    });

    // --- Warm chord pad underneath (very subtle, fills space) ---
    [261.63, 329.63, 392.00].forEach(freq => {  // C4 E4 G4
      const osc = ctx.createOscillator(); const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      og.gain.setValueAtTime(0, now);
      og.gain.linearRampToValueAtTime(0.025, now + 0.4);
      og.gain.setValueAtTime(0.025, now + barLen - 0.5);
      og.gain.linearRampToValueAtTime(0, now + barLen);
      osc.connect(og); og.connect(masterGain); osc.start(now); osc.stop(now + barLen + 0.1);
    });

    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── Phonk (Sigma Drift Edits) ──────────────────────────────

function createPhonk(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 130;
  const beat = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;

    for (let i = 0; i < 8; i++) {
      const t = now + i * (beat * 0.5);
      // Heavy 808 on 1 and 3
      if (i === 0 || i === 4) {
        const k = ctx.createOscillator(); const kg = ctx.createGain();
        k.type = 'sine'; k.frequency.setValueAtTime(55, t); k.frequency.exponentialRampToValueAtTime(22, t + 0.6);
        kg.gain.setValueAtTime(0.55, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.7);
      }
      // Cowbell on every 8th note (iconic phonk sound)
      const cow = ctx.createOscillator(); const cg = ctx.createGain();
      cow.type = 'square'; cow.frequency.setValueAtTime(i % 2 === 0 ? 800 : 540, t);
      cg.gain.setValueAtTime(i % 4 === 0 ? 0.09 : 0.05, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      cow.connect(cg); cg.connect(masterGain); cow.start(t); cow.stop(t + 0.08);
      // Clap on 2 and 4
      if (i === 2 || i === 6) {
        const sz = ctx.sampleRate * 0.06; const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0); for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
        const src = ctx.createBufferSource(); const sg = ctx.createGain(); const f = ctx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 1800; src.buffer = buf;
        sg.gain.setValueAtTime(0.2, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        src.connect(f); f.connect(sg); sg.connect(masterGain); src.start(t);
      }
    }
    // Dark bass melody
    [55, 0, 65.41, 0, 55, 73.42, 0, 55].forEach((freq, i) => {
      if (freq === 0) return;
      const t = now + i * (beat * 0.5);
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t);
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 400;
      g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(flt); flt.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.3);
    });
    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── Dramatic Piano (Reveal / Storytime) ─────────────────────

function createDramaticPiano(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const chords = [
    [220, 261.63, 329.63],       // Am
    [196, 246.94, 293.66],       // G
    [174.61, 220, 261.63],       // F
    [164.81, 207.65, 329.63],    // Em7
  ];
  let chordIdx = 0;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const duration = 3.5;
    const chord = chords[chordIdx % chords.length];
    chordIdx++;

    // Piano-like pluck for each note in chord
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.18, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.04, now + i * 0.08 + 0.4);
      g.gain.linearRampToValueAtTime(0, now + duration);
      osc.connect(g); g.connect(masterGain); osc.start(now + i * 0.08); osc.stop(now + duration + 0.1);
      // Octave above, softer
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = 'sine'; o2.frequency.setValueAtTime(freq * 2, now + i * 0.08);
      g2.gain.setValueAtTime(0.05, now + i * 0.08); g2.gain.linearRampToValueAtTime(0, now + duration);
      o2.connect(g2); g2.connect(masterGain); o2.start(now + i * 0.08); o2.stop(now + duration + 0.1);
    });
    // Deep reverb-like bass
    const bass = ctx.createOscillator(); const bg = ctx.createGain();
    bass.type = 'sine'; bass.frequency.setValueAtTime(chord[0] * 0.5, now);
    bg.gain.setValueAtTime(0.12, now); bg.gain.linearRampToValueAtTime(0, now + duration);
    bass.connect(bg); bg.connect(masterGain); bass.start(now); bass.stop(now + duration + 0.1);

    setTimeout(loop, duration * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── Reggaeton (Latin Bounce) ────────────────────────────────

function createReggaeton(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 95; // Dembow tempo
  const beat = 60 / tempo;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;

    // Dembow rhythm pattern (the signature reggaeton bounce)
    // Kick: _ _ X _ | _ _ X _ (offbeat kicks)
    // Snare: _ X _ X | _ X _ X
    for (let i = 0; i < 8; i++) {
      const t = now + i * (beat * 0.5);
      // Kick on offbeats (2,6 = the dembow feel)
      if (i === 2 || i === 6) {
        const k = ctx.createOscillator(); const kg = ctx.createGain();
        k.type = 'sine'; k.frequency.setValueAtTime(130, t); k.frequency.exponentialRampToValueAtTime(35, t + 0.18);
        kg.gain.setValueAtTime(0.4, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.22);
      }
      // Snare / rim on 1,3,5,7 (offsets)
      if (i % 2 === 1) {
        const sz = ctx.sampleRate * 0.04; const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0); for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
        const src = ctx.createBufferSource(); const sg = ctx.createGain(); const f = ctx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 4000; f.Q.value = 2;
        src.buffer = buf; sg.gain.setValueAtTime(0.12, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        src.connect(f); f.connect(sg); sg.connect(masterGain); src.start(t);
      }
      // Hi-hat on all 8ths
      const hsz = ctx.sampleRate * 0.02; const hb = ctx.createBuffer(1, hsz, ctx.sampleRate);
      const hd = hb.getChannelData(0); for (let j = 0; j < hsz; j++) hd[j] = (Math.random() * 2 - 1) * 0.5;
      const hs = ctx.createBufferSource(); const hg = ctx.createGain(); const hf = ctx.createBiquadFilter();
      hf.type = 'highpass'; hf.frequency.value = 9000; hs.buffer = hb;
      hg.gain.setValueAtTime(0.04, t); hg.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      hs.connect(hf); hf.connect(hg); hg.connect(masterGain); hs.start(t);
    }
    // Bouncy bass synth
    [130.81, 0, 130.81, 146.83, 0, 130.81, 110, 0].forEach((freq, i) => {
      if (freq === 0) return;
      const t = now + i * (beat * 0.5);
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t);
      const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 600;
      g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(fl); fl.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.25);
    });
    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── Bollywood Fusion ────────────────────────────────────────

function createBollywood(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 125;
  const beat = 60 / tempo;

  // Indian scale (Raag Bhairav-ish): C Db E F G Ab B
  const scaleNotes = [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88];

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;

    // Tabla-style kick (dha)
    [0, 2].forEach(b => {
      const t = now + b * beat;
      const k = ctx.createOscillator(); const kg = ctx.createGain();
      k.type = 'sine'; k.frequency.setValueAtTime(180, t); k.frequency.exponentialRampToValueAtTime(60, t + 0.15);
      kg.gain.setValueAtTime(0.35, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.2);
    });
    // Tabla tin (high pitched hit on offbeats)
    [1, 3].forEach(b => {
      const t = now + b * beat;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(600, t + 0.08);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.1);
    });
    // Rapid tabla fill (tirakita pattern)
    for (let i = 0; i < 4; i++) {
      const t = now + beat * 3 + i * (beat * 0.25);
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(700 + i * 100, t);
      g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.06);
    }
    // Sitar-style melody (sine with vibrato)
    const melodyIdxs = [0, 2, 4, 6, 4, 2, 0, 3];
    melodyIdxs.forEach((idx, i) => {
      const t = now + i * (beat * 0.5);
      const freq = scaleNotes[idx];
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freq, t);
      // Vibrato for sitar feel
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.frequency.value = 6; lg.gain.value = 5;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + 0.35);
      g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.35);
    });
    // Drone tanpura (constant Sa)
    const drone = ctx.createOscillator(); const dg = ctx.createGain();
    drone.type = 'sine'; drone.frequency.setValueAtTime(130.81, now); // C3
    dg.gain.setValueAtTime(0.04, now); dg.gain.setValueAtTime(0.04, now + barLen - 0.3); dg.gain.linearRampToValueAtTime(0, now + barLen);
    drone.connect(dg); dg.connect(masterGain); drone.start(now); drone.stop(now + barLen + 0.1);

    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; };
}

// ─── EDM Drop (Hype Build + Drop) ───────────────────────────

function createEDMDrop(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 128;
  const beat = 60 / tempo;
  let phase = 0;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;
    const isBuild = phase % 4 < 2; // 2 bars build, 2 bars drop

    if (isBuild) {
      // Rising noise sweep
      const sz = ctx.sampleRate * barLen; const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
      const d = buf.getChannelData(0); for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource(); const sg = ctx.createGain(); const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.setValueAtTime(200, now); f.frequency.exponentialRampToValueAtTime(8000, now + barLen);
      src.buffer = buf; sg.gain.setValueAtTime(0.02, now); sg.gain.linearRampToValueAtTime(0.12, now + barLen);
      src.connect(f); f.connect(sg); sg.connect(masterGain); src.start(now);
      // Accelerating snare rolls
      const rollCount = 4 + phase * 4;
      for (let i = 0; i < Math.min(rollCount, 16); i++) {
        const t = now + (barLen / rollCount) * i;
        const rsz = ctx.sampleRate * 0.04; const rb = ctx.createBuffer(1, rsz, ctx.sampleRate);
        const rd = rb.getChannelData(0); for (let j = 0; j < rsz; j++) rd[j] = (Math.random() * 2 - 1);
        const rs = ctx.createBufferSource(); const rg = ctx.createGain(); const rf = ctx.createBiquadFilter();
        rf.type = 'highpass'; rf.frequency.value = 2000; rs.buffer = rb;
        rg.gain.setValueAtTime(0.08 + i * 0.01, t); rg.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        rs.connect(rf); rf.connect(rg); rg.connect(masterGain); rs.start(t);
      }
      // Rising pitch
      const rise = ctx.createOscillator(); const rg2 = ctx.createGain();
      rise.type = 'sawtooth'; rise.frequency.setValueAtTime(200, now); rise.frequency.exponentialRampToValueAtTime(2000, now + barLen);
      const rf2 = ctx.createBiquadFilter(); rf2.type = 'lowpass'; rf2.frequency.value = 3000;
      rg2.gain.setValueAtTime(0.03, now); rg2.gain.linearRampToValueAtTime(0.08, now + barLen);
      rise.connect(rf2); rf2.connect(rg2); rg2.connect(masterGain); rise.start(now); rise.stop(now + barLen + 0.1);
    } else {
      // DROP — heavy kick, synth stab, bass
      for (let i = 0; i < 4; i++) {
        const t = now + i * beat;
        // Kick
        const k = ctx.createOscillator(); const kg = ctx.createGain();
        k.type = 'sine'; k.frequency.setValueAtTime(200, t); k.frequency.exponentialRampToValueAtTime(30, t + 0.25);
        kg.gain.setValueAtTime(0.5, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.3);
        // Synth stab chord
        if (i === 0 || i === 2) {
          [130.81, 164.81, 196].forEach(freq => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, t);
            const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 1200;
            g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.8);
            o.connect(fl); fl.connect(g); g.connect(masterGain); o.start(t); o.stop(t + beat);
          });
        }
      }
      // Offbeat hi-hats
      for (let i = 0; i < 8; i++) {
        if (i % 2 === 1) {
          const t = now + i * (beat * 0.5);
          const hsz = ctx.sampleRate * 0.03; const hb = ctx.createBuffer(1, hsz, ctx.sampleRate);
          const hd = hb.getChannelData(0); for (let j = 0; j < hsz; j++) hd[j] = (Math.random() * 2 - 1);
          const hs = ctx.createBufferSource(); const hg = ctx.createGain(); const hf = ctx.createBiquadFilter();
          hf.type = 'highpass'; hf.frequency.value = 9000; hs.buffer = hb;
          hg.gain.setValueAtTime(0.06, t); hg.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
          hs.connect(hf); hf.connect(hg); hg.connect(masterGain); hs.start(t);
        }
      }
    }
    phase++;
    setTimeout(loop, barLen * 1000);
  };
  loop();
  return () => { stopped = true; phase = 0; };
}

// ─── Acoustic Happy (Feel-Good Lifestyle) ────────────────────

function createAcousticHappy(ctx: AudioContext, masterGain: GainNode): () => void {
  let stopped = false;
  const tempo = 105;
  const beat = 60 / tempo;
  // Bright major chord progression: G C Em D
  const chords = [
    [196, 246.94, 293.66, 392],     // G
    [261.63, 329.63, 392, 523.25],  // C
    [164.81, 196, 246.94, 329.63],  // Em
    [146.83, 185, 220, 293.66],     // D
  ];
  let chordIdx = 0;

  const loop = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const barLen = beat * 4;
    const chord = chords[chordIdx % chords.length];
    chordIdx++;

    // Strummed guitar pattern (staggered plucks)
    for (let s = 0; s < 4; s++) {
      const strumTime = now + s * beat;
      chord.forEach((freq, i) => {
        const t = strumTime + i * 0.025; // stagger for strum feel
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(s === 0 ? 0.12 : 0.07, t);
        g.gain.exponentialRampToValueAtTime(0.02, t + 0.3);
        g.gain.linearRampToValueAtTime(0, t + beat * 0.9);
        o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + beat);
      });
    }
    // Light percussion (shaker 8ths)
    for (let i = 0; i < 8; i++) {
      const t = now + i * (beat * 0.5);
      const sz = ctx.sampleRate * 0.015; const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
      const d = buf.getChannelData(0); for (let j = 0; j < sz; j++) d[j] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource(); const sg = ctx.createGain(); const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 7000; src.buffer = buf;
      sg.gain.setValueAtTime(i % 2 === 0 ? 0.05 : 0.03, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
      src.connect(f); f.connect(sg); sg.connect(masterGain); src.start(t);
    }
    // Kick on 1 and 3 (soft)
    [0, 2].forEach(b => {
      const t = now + b * beat;
      const k = ctx.createOscillator(); const kg = ctx.createGain();
      k.type = 'sine'; k.frequency.setValueAtTime(100, t); k.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      kg.gain.setValueAtTime(0.2, t); kg.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      k.connect(kg); kg.connect(masterGain); k.start(t); k.stop(t + 0.16);
    });
    // Melodic whistle (sine, bright)
    const whistleNotes = [392, 440, 523.25, 440, 392, 329.63, 293.66, 329.63];
    whistleNotes.forEach((freq, i) => {
      const t = now + i * (beat * 0.5);
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(freq * 2, t); // octave up for whistle
      g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.25);
    });

    setTimeout(loop, barLen * 1000);
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
  epic: createEpicDrums,
  trap: createDarkTrap,
  synthwave: createRetroSynthwave,
  horror: createHorrorSuspense,
  motivational: createMotivationalBuild,
  linkedin: createLinkedInPro,
  phonk: createPhonk,
  piano: createDramaticPiano,
  reggaeton: createReggaeton,
  bollywood: createBollywood,
  edm: createEDMDrop,
  acoustic: createAcousticHappy,
};

export const MUSIC_TRACKS = {
  none:         { name: 'No Music' },
  linkedin:     { name: '💼 LinkedIn Pro' },
  motivational: { name: '🚀 Motivational' },
  acoustic:     { name: '🎸 Acoustic Happy' },
  piano:        { name: '🎹 Dramatic Piano' },
  bollywood:    { name: '🪷 Bollywood Fusion' },
  phonk:        { name: '🏎️ Phonk' },
  edm:          { name: '💥 EDM Drop' },
  reggaeton:    { name: '🔊 Reggaeton' },
  upbeat:       { name: 'Upbeat Pop' },
  lofi:         { name: 'Lo-Fi Chill' },
  cinematic:    { name: 'Cinematic Drone' },
  ambient:      { name: 'Ambient Pad' },
  techno:       { name: 'Techno Beat' },
  pop:          { name: 'Chillwave' },
  epic:         { name: '⚡ Epic Drums' },
  trap:         { name: '🔥 Dark Trap' },
  synthwave:    { name: '🌆 Synthwave' },
  horror:       { name: '💀 Horror' },
};

// ─── Component ───────────────────────────────────────────────

interface BackgroundMusicProps {
  trackId: keyof typeof MUSIC_TRACKS;
  isPlaying: boolean;
  volume?: number;
}

import { getAudioContext, unlockAudio } from '../lib/AudioEngine';

export default function BackgroundMusic({ trackId, isPlaying, volume = 0.5 }: BackgroundMusicProps) {
  const stopFnRef = useRef<(() => void) | null>(null);
  const activeTrackRef = useRef<string>('none');

  useEffect(() => {
    // Stop any currently playing track
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }

    activeTrackRef.current = trackId;

    if (trackId === 'none' || !isPlaying) {
      return;
    }

    const generator = TRACK_GENERATORS[trackId];
    if (!generator) return;

    // Get the shared audio context
    const { ctx, masterGain } = getAudioContext();
    if (!ctx || !masterGain) return; // Context might not be unlocked yet

    // Set initial volume
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);

    // If context is suspended, try resuming (though it should ideally 
    // be unlocked by user interaction in App.tsx before we reach here)
    if (ctx.state === 'suspended') {
        unlockAudio();
    }

    // Start playing
    stopFnRef.current = generator(ctx, masterGain);

    return () => {
      if (stopFnRef.current) {
        stopFnRef.current();
        stopFnRef.current = null;
      }
    };
  }, [trackId, isPlaying]);

  // Update volume in real-time
  useEffect(() => {
    const { ctx, masterGain } = getAudioContext();
    if (masterGain && ctx && ctx.state === 'running') {
      masterGain.gain.linearRampToValueAtTime(
        volume, 
        ctx.currentTime + 0.1
      );
    }
  }, [volume]);

  return null;
}
