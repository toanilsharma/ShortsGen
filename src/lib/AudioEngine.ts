// src/lib/AudioEngine.ts

let sharedAudioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let streamDestination: MediaStreamAudioDestinationNode | null = null;

export const getAudioContext = () => {
  return { ctx: sharedAudioContext, masterGain, streamDestination };
};

export const unlockAudio = (): boolean => {
  try {
    if (!sharedAudioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        sharedAudioContext = new Ctx();
        masterGain = sharedAudioContext.createGain();
        streamDestination = sharedAudioContext.createMediaStreamDestination();
        masterGain.connect(sharedAudioContext.destination);
        masterGain.connect(streamDestination);
      }
    }
    
    if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {});
    }
    return true;
  } catch (e) {
    console.warn("Failed to unlock AudioContext:", e);
    return false;
  }
};
