import React, { useEffect, useRef } from 'react';

export const MUSIC_TRACKS = {
  none: { name: 'No Music', url: '' },
  techno: { name: 'Industrial Techno', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a17256.mp3' }, // Techno Loop
  lofi: { name: 'Lo-Fi Chill', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_180873748b.mp3' }, // Lo-Fi
  cinematic: { name: 'Cinematic Urgency', url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_1975e54911.mp3' } // Dramatic
};

interface BackgroundMusicProps {
  trackId: keyof typeof MUSIC_TRACKS;
  isPlaying: boolean;
  volume?: number;
}

export default function BackgroundMusic({ trackId, isPlaying, volume = 0.4 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    
    if (trackId === 'none' || !MUSIC_TRACKS[trackId].url) {
      audio.pause();
      return;
    }

    if (audio.src !== MUSIC_TRACKS[trackId].url) {
      audio.src = MUSIC_TRACKS[trackId].url;
      audio.load();
    }

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play error:", e));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [trackId, isPlaying, volume]);

  return null; // This component handles audio globally without UI
}
