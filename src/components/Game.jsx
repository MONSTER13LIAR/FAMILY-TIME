import React, { useState } from 'react';
import { sounds } from '../utils/soundManager';

const Game = ({ players, myPlayerId, isHost, word, isImpostor, turnIndex, hints, gameState, onProvideHint, onStartVoting, onNextRoundHints }) => {
  const [myHint, setMyHint] = useState('');
  
  const currentPlayer = players[turnIndex];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isRoundComplete = gameState === 'round_complete';
  
  const playingPlayers = players.filter(p => p.isPlayingThisRound) || [];
  const playerCount = playingPlayers.length || 1;
  const safeHintsLength = hints?.length || 0;
  const currentRoundNum = Math.floor(safeHintsLength / playerCount) + 1;
  const lastHintIndexInPrevRound = (currentRoundNum - 1) * playerCount;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (myHint.trim()) {
      sounds.click();
      onProvideHint(myHint.trim().split(' ')[0]);
      setMyHint('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 pt-24 pb-32 md:pb-12 relative animate-fade-in z-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* Secret Identity Card */}
        <div className={`w-full flex flex-col items-center justify-center p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isImpostor 
            ? 'bg-rose-950/20 border border-rose-900/50 shadow-[0_0_80px_rgba(225,29,72,0.1)]' 
            : 'bg-emerald-950/20 border border-emerald-900/50 shadow-[0_0_80px_rgba(16,185,129,0.1)]'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-br opacity-30 ${isImpostor ? 'from-rose-900 to-slate-900' : 'from-emerald-900 to-slate-900'}`}></div>
          
          {isImpostor ? (
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="text-4xl md:text-6xl mb-4 md:mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(225,29,72,0.5)]">🎭</div>
              <h2 className="text-3xl md:text-6xl font-black text-rose-500 tracking-tight uppercase mb-2 md:mb-4 drop-shadow-xl">You are the Impostor</h2>
              <p className="text-rose-100/70 text-sm md:text-lg font-medium max-w-2xl leading-relaxed bg-rose-950/40 px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-rose-900/30 backdrop-blur-sm">
                Watch the hints carefully. Blend in and don't get caught!
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-emerald-500/80 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">Your Secret Word</span>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-widest uppercase mb-4 md:mb-6 drop-shadow-2xl bg-gradient-to-b from-white to-emerald-200 bg-clip-text text-transparent">{word}</h2>
              <p className="text-emerald-100/70 text-sm md:text-lg font-medium max-w-2xl bg-emerald-950/40 px-6 py-3 md:px-8 md:py-4 rounded-2xl border border-emerald-900/30 backdrop-blur-sm">
                Give a subtle hint that normal players will understand.
              </p>
              <div className="mt-6 px-4 py-2 bg-emerald-500/20 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                ROUND {currentRoundNum}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
          {/* Main Action Area */}
          <div className="lg:col-span-8 flex flex-col bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl min-h-[350px] md:min-h-[450px] relative overflow-hidden order-1 lg:order-none">
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in relative z-10">
              {/* Round Boundary Message & Host Actions */}
              {isRoundComplete ? (
                <div className="flex flex-col items-center animate-fade-in mb-8">
                  <div className="text-6xl md:text-8xl mb-6 md:mb-8 animate-[float_4s_ease-in-out_infinite]">🗳️</div>
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 md:mb-6">All Hints Given!</h3>
                  <p className="text-slate-300 text-sm md:text-xl font-medium mb-8 md:mb-12 max-w-xl leading-relaxed">Analyze the hints and find the Impostor.</p>
                  
                  {isHost ? (
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <button 
                        onClick={onNextRoundHints}
                        className="px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl border border-white/10"
                      >
                        Another Round
                      </button>
                      <button 
                        onClick={onStartVoting}
                        className="px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl border border-white/10"
                      >
                        Start Voting
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 md:py-6 px-6 md:px-10 bg-white/5 text-slate-400 font-bold uppercase tracking-widest rounded-2xl border border-white/5 text-sm md:text-lg animate-pulse w-full max-w-lg text-center">
                      Waiting for Host...
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="mb-6 md:mb-10 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-4 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-[float_4s_ease-in-out_infinite] mb-4 md:mb-8 mx-auto overflow-hidden">
                      <span className="text-3xl md:text-5xl font-black text-white">{currentPlayer?.name?.substring(0, 2).toUpperCase() || "..."}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-white tracking-tight">It's <span className="text-blue-400">{currentPlayer?.name || "Someone's"}</span> Turn</h3>
                  </div>

                  {isMyTurn ? (
                    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4 md:gap-6 animate-fade-in bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-blue-500/20">
                      <input 
                        type="text" 
                        placeholder="One word..." 
                        value={myHint}
                        onChange={(e) => setMyHint(e.target.value.trim().split(' ')[0])} 
                        className="w-full px-6 py-4 md:py-5 bg-slate-950 border-2 border-slate-800 rounded-xl md:rounded-2xl text-xl md:text-2xl font-black text-center text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 tracking-wide"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        disabled={!myHint.trim()}
                        className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-50 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all duration-300 active:scale-95 text-lg md:text-xl disabled:cursor-not-allowed border-b-4 border-black/20 active:border-b-0"
                      >
                        Submit Hint
                      </button>
                      <p className="text-blue-400/60 text-[10px] md:text-xs font-black uppercase tracking-widest">Only 1 word allowed. No spaces.</p>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center gap-4 md:gap-6 text-slate-400 mt-2 bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 w-full max-w-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                      </div>
                      <span className="text-base md:text-xl font-bold uppercase tracking-[0.2em]">Waiting for hint...</span>
                    </div>
                  )}

                  {/* Manual Vote Button for Host at round boundaries */}
                  {isHost && hints.length > 0 && 
                   hints.length % (players.filter(p => p.isPlayingThisRound).length || 1) === 0 && (
                    <div className="mt-8 md:mt-12 w-full max-w-lg animate-fade-in">
                        <div className="h-px bg-white/10 w-full mb-8"></div>
                        <button 
                          onClick={onStartVoting}
                          className="w-full py-4 md:py-6 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500 hover:to-emerald-500 text-teal-400 hover:text-white border-2 border-teal-500/30 hover:border-teal-400 font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl"
                        >
                          Finish & Start Voting
                        </button>
                        <p className="mt-4 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Round Complete. You can vote now or continue playing.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity / Hints Log */}
          <div className="lg:col-span-4 flex flex-col bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl lg:h-[550px] relative order-2 lg:order-none">
            <h4 className="text-lg md:text-xl font-black text-white mb-4 md:mb-6 uppercase tracking-[0.2em] flex items-center gap-3 pb-3 border-b border-white/10">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Hint Board
            </h4>
            <div className="flex flex-col gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
              {hints.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-10">
                  <span className="text-3xl mb-3">🕵️‍♂️</span>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">No hints yet</p>
                </div>
              ) : (
                hints.map((hintObj, i) => {
                  const p = players.find(p => p.id === hintObj.playerId);
                  const showRoundLabel = i % playingPlayers.length === 0;
                  const roundNumber = Math.floor(i / playingPlayers.length) + 1;
                  
                  return (
                    <React.Fragment key={i}>
                      {showRoundLabel && (
                        <div className="flex items-center gap-3 py-2 mt-4 first:mt-0">
                          <div className="h-px flex-1 bg-white/10"></div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Round {roundNumber}</span>
                          <div className="h-px flex-1 bg-white/10"></div>
                        </div>
                      )}
                      <div className="flex flex-col p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5 shadow-lg animate-fade-in group hover:bg-white/10 transition-colors">
                        <span className="text-[10px] md:text-xs text-blue-400 font-black uppercase tracking-[0.2em] mb-1">{p?.name || 'Unknown'}</span>
                        <span className="text-lg md:text-2xl font-black text-white break-words capitalize tracking-wide">"{hintObj.hint}"</span>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none rounded-b-[2.5rem]"></div>
          </div>
        </div>

        {/* Global Player Strip - Sticky at bottom for mobile, fixed at bottom for desktop */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-4 py-4 md:relative md:bg-white/5 md:border md:rounded-3xl md:mt-4 z-40 transition-all">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar md:justify-center md:flex-wrap">
            {players.map((p, i) => (
               <div key={p.id} className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl transition-all shrink-0 border ${
                 i === turnIndex && !isRoundComplete 
                   ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105' 
                   : 'text-slate-400 bg-white/5 border-white/5'
               }`}>
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${hints.slice(lastHintIndexInPrevRound).some(h => h.playerId === p.id) ? 'bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'bg-slate-700'}`}></div>
                  <span className="font-black uppercase tracking-wider text-[10px] md:text-sm whitespace-nowrap">{p?.name || 'Unknown'} {p.id === myPlayerId && '(You)'}</span>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
