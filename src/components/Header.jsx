import React, { useState } from 'react';
import { setSoundEnabled, isSoundEnabled, sounds } from '../utils/soundManager';

const Header = ({ onExitRoom, inRoom, isGameActive }) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) sounds.click();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent tracking-tighter drop-shadow-sm uppercase">
          Family Time
        </h1>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title="Toggle Sound"
            className={`flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl border font-black text-[10px] md:text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
              soundOn
                ? 'bg-teal-500/10 border-teal-500/20 text-teal-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-500'
            }`}
          >
            {soundOn ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9 9L3 12l6 3" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            <span className="hidden sm:inline">{soundOn ? 'Sound On' : 'Muted'}</span>
          </button>

          <div className="flex flex-col items-end">
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 font-black mb-0.5 leading-none">CREATOR</span>
            <span className="text-xs md:text-base text-white font-black tracking-tight px-2 py-1 bg-white/5 rounded-lg border border-white/5">
              Monstrolier
            </span>
          </div>

          {inRoom && !isGameActive && (
            <button
              onClick={onExitRoom}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl hover:bg-rose-500/20 transition-all active:scale-95 shadow-lg shadow-rose-950/20"
            >
              Exit
            </button>
          )}
        </div>
      </div>
      {/* Animated Bottom Border */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400 to-transparent w-1/2 animate-[shimmer_3s_infinite] shadow-[0_0_15px_rgba(45,212,191,0.4)]"></div>
      </div>
    </header>
  );
};

export default Header;
