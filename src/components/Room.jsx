import React, { useState } from 'react';
import PlayerList from './PlayerList';
import { sounds } from '../utils/soundManager';

const Room = ({ roomCode, isHost, players, myPlayerId, maxPlayers, onStartGame, onLeave, onAddBot }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    sounds.click();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => { sounds.click(); onLeave(); };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 pt-24 pb-12 relative animate-fade-in z-10">
      <button onClick={handleLeave} className="absolute top-24 left-4 md:left-12 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] md:text-sm active:scale-95">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Leave
      </button>

      <div className="w-full max-w-6xl flex flex-col gap-6 md:gap-8 mx-auto mt-6">
        
        {/* Room Header Info */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center justify-between bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-64 bg-teal-400/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col items-center md:items-start relative z-10">
            <span className="text-slate-400 uppercase tracking-[0.3em] text-[10px] md:text-xs font-black mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
              ROOM CODE
            </span>
            <div className="flex items-center gap-3 md:gap-4 bg-slate-950/80 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 shadow-inner w-full md:w-auto justify-center">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em]">{roomCode}</h2>
              <button 
                onClick={handleCopy}
                className={`p-3 md:p-4 rounded-xl text-slate-400 transition-all border active:scale-95 ${copied ? 'bg-teal-500/30 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'bg-white/5 hover:bg-teal-500/20 hover:text-teal-300 border-white/10 hover:border-teal-400/50'}`}
                title="Copy Room Code"
              >
                {copied ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-full md:min-w-[280px] relative z-10 mt-2 md:mt-0">
            {isHost ? (
              <button 
                onClick={onStartGame}
                disabled={players.length < 3}
                className="w-full py-4 md:py-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-xl md:rounded-3xl shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl disabled:shadow-none border border-white/10 active:border-b-0 active:translate-y-1"
              >
                Start Game
              </button>
            ) : (
              <div className="w-full py-4 md:py-6 bg-white/5 text-slate-500 font-bold uppercase tracking-widest rounded-xl md:rounded-3xl border border-white/5 text-center text-base md:text-xl animate-pulse">
                Waiting for host...
              </div>
            )}
            {players.length < 3 && (
              <div className="bg-amber-500/10 border border-amber-500/10 px-4 py-2 rounded-lg text-amber-500/80 text-[10px] md:text-xs text-center font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Need 3+ Players
              </div>
            )}
          </div>
        </div>

        {/* Player List */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-blue-500/5 blur-[80px] rounded-t-full pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 pb-5 md:pb-8 border-b border-white/10 gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/20">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none uppercase">Players</h3>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm mt-1">{players.length} / {maxPlayers} JOINED</span>
              </div>
            </div>
            
            {isHost && players.length < maxPlayers && (
              <button onClick={onAddBot} className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all text-[10px] md:text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                Add Bot
              </button>
            )}
          </div>
          
          <div className="relative z-10 w-full">
            <PlayerList 
              players={players} 
              myPlayerId={myPlayerId} 
              onRemoveBot={isHost ? onRemoveBot : null} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Room;
