import React, { useState } from 'react';
import { sounds } from '../utils/soundManager';

const Lobby = ({ onCreateRoom, onJoinRoom, onBack }) => {
  const [roomId, setRoomId] = useState('');

  const handleCreate = () => { sounds.click(); onCreateRoom(); };
  const handleJoin = () => { if (roomId.trim() && roomId.length >= 3) { sounds.click(); onJoinRoom(roomId.trim()); } };
  const handleBack = () => { sounds.click(); onBack(); };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-24 md:py-32 relative animate-fade-in z-10">
      <button onClick={handleBack} className="absolute top-24 left-4 md:left-12 text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] md:text-sm active:scale-95">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back
      </button>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center shadow-2xl max-w-sm sm:max-w-md w-full relative overflow-hidden">
        <div className="absolute inset-x-0 -top-20 h-40 bg-teal-400/10 blur-[60px] rounded-full"></div>
        <div className="absolute inset-x-0 -bottom-20 h-40 bg-blue-500/10 blur-[60px] rounded-full"></div>

        <div className="text-5xl md:text-6xl mb-4 relative z-10 animate-[float_4s_ease-in-out_infinite]">🕵️</div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight relative z-10 uppercase">Game Lobby</h2>
        <p className="text-slate-300/70 mb-8 md:mb-10 font-medium relative z-10 text-sm md:text-lg leading-snug">Start a match or enter a friend's code.</p>

        <button 
          onClick={handleCreate}
          className="relative z-10 w-full py-4 md:py-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 active:scale-95 text-lg md:text-xl border border-white/10"
        >
          Create Room
        </button>

        <div className="flex items-center w-full my-6 md:my-8 gap-4 relative z-10">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full bg-slate-900 absolute left-1/2 -translate-x-1/2">JOIN</span>
        </div>

        <div className="w-full flex flex-col gap-4 relative z-10">
          <input 
            type="text" 
            placeholder="Room Code" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full px-6 py-4 md:py-5 bg-slate-950 border-2 border-white/10 rounded-2xl text-center text-xl md:text-2xl font-black text-white uppercase tracking-[0.3em] focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all placeholder:text-slate-800"
            maxLength={6}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button 
            onClick={handleJoin}
            disabled={!roomId.trim() || roomId.length < 3}
            className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 active:scale-95 text-lg md:text-xl border border-white/10"
          >
            Enter Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
