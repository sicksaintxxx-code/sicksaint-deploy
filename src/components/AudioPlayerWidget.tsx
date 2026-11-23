'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw, VolumeX, Sparkles } from 'lucide-react';

interface AudioPlayerWidgetProps {
  title: string;
  durationSeconds?: number;
  authorName: string;
}

export default function AudioPlayerWidget({
  title,
  durationSeconds = 600,
  authorName,
}: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds, playbackSpeed]);

  // Voice narration using Web Speech Synthesis API
  const togglePlay = () => {
    if (typeof window === 'undefined') return;

    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window && !isMuted) {
        window.speechSynthesis.cancel();
        const textToSpeak = `SICKSAINT audio dispatch. ${title}. Authored by ${authorName}. High-signal international editorial transmission.`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = playbackSpeed * 0.95;
        utterance.pitch = 0.9;
        utterance.onend = () => {
          // Keep timer playing or loop ambient
        };
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="my-8 p-5 sm:p-6 bg-brand-surface border border-brand-border transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Play Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause narration' : 'Play narrated edition'}
            className="w-12 h-12 flex items-center justify-center bg-brand-accent text-brand-bg hover:bg-white transition-all rounded-full shrink-0 shadow-lg active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-brand-accent uppercase font-bold">
              <Volume2 className="w-3.5 h-3.5" />
              <span>NARRATED EDITORIAL DISPATCH</span>
              <span className="text-brand-border">·</span>
              <span className="text-brand-textSubtle font-normal">SICKSAINT AUDIO LAB</span>
            </div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-brand-text leading-tight mt-0.5 line-clamp-1">
              {title}
            </h4>
          </div>
        </div>

        {/* Animated Sound Frequency Equalizer & Controls */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          {/* Waveform Bars */}
          <div className="hidden md:flex items-center gap-1 h-5 px-2">
            {[40, 75, 55, 90, 65, 80, 50, 85, 60, 95, 70, 45].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-brand-accent rounded-full transition-all duration-200"
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (i % 2 === 0 ? 1 : 0.7))) * 0.22}px` : '4px',
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Speed Toggle */}
          <button
            onClick={toggleSpeed}
            className="px-2 py-1 bg-brand-card border border-brand-border text-[10px] font-mono font-bold text-brand-text hover:border-brand-accent transition-colors"
          >
            {playbackSpeed}X
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            title="Restart Narration"
            className="p-1.5 text-brand-textMuted hover:text-brand-text hover:bg-brand-card rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Progress & Timing */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-brand-textMuted">
            <span>{formatSeconds(currentTime)}</span>
            <div className="w-20 sm:w-28 h-1.5 bg-brand-card rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-accent transition-all duration-300"
                style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
              />
            </div>
            <span>{formatSeconds(durationSeconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
