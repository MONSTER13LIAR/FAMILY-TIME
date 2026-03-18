import React, { useState } from 'react';
import { sounds } from '../utils/soundManager';

const NameInput = ({ isHost, onContinue, onBack }) => {
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);

  const handleContinue = () => {
    if (name.trim()) { sounds.click(); onContinue(name.trim(), maxPlayers); }
  };
  const handleBack = () => { sounds.click(); onBack(); };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-24 md:py-32 relative animate-fade-in z-10">
      <button onClick={handleBack} className="absolute top-24 left-4 md:left-12 text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] md:text-sm active:scale-95">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back
      </button>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center shadow-2xl max-w-sm sm:max-w-md w-full relative overflow-hidden">
        <div className="absolute inset-x-0 -top-20 h-40 bg-blue-500/10 blur-[60px] rounded-full shadow-[0_0_40px_rgba(59,130,246,0.1)]"></div>
        <div className="absolute inset-x-0 -bottom-20 h-40 bg-teal-500/10 blur-[60px] rounded-full shadow-[0_0_40px_rgba(45,212,191,0.1)]"></div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight relative z-10 uppercase">Identity</h2>
        <p className="text-slate-300/70 mb-8 md:mb-10 font-medium relative z-10 text-sm md:text-lg leading-snug">Choose a name to enter the room.</p>

        <div className="w-full flex flex-col gap-4 md:gap-6 relative z-10">
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 md:py-5 bg-slate-950 border-2 border-white/10 rounded-2xl text-lg md:text-xl font-bold text-white focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all placeholder:text-slate-800"
            maxLength={12}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          />
          
          {isHost && (
            <div className="flex flex-col items-start w-full bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 shadow-inner">
              <label className="text-slate-400 font-black uppercase tracking-widest text-[10px] md:text-xs mb-3 ml-1">MAX PLAYERS: <span className="text-teal-400 text-base md:text-lg">{maxPlayers}</span></label>
              <input 
                type="range" 
                min="3" 
                max="10" 
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="w-full accent-teal-400 mb-1"
              />
              <div className="flex justify-between w-full text-slate-600 text-[10px] md:text-xs font-black px-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
          )}

          <button 
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-4 md:py-5 bg-gradient-to-r from-teal-500 to-emerald-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 active:scale-95 text-lg md:text-xl border border-white/10"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
