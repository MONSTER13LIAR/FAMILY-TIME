import React, { useState } from 'react';
import { sounds } from '../utils/soundManager';

const Voting = ({ players, myPlayerId, hints, onVote, hasVoted, votes = {} }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [historyPlayerId, setHistoryPlayerId] = useState(null);

  const playingPlayers = players.filter(p => p.isPlayingThisRound && !p.isDisconnected);
  const pendingPlayers = playingPlayers.filter(p => !votes[p.id]);

  const historyPlayer = players.find(p => p.id === historyPlayerId);
  const playerHints = historyPlayer ? hints.filter(h => h.playerId === historyPlayer.id) : [];

  const handleVoteClick = () => {
    if (selectedId) {
      sounds.click();
      onVote(selectedId);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-24 md:py-32 relative animate-fade-in z-10">
      <div className="w-full max-w-6xl flex flex-col items-center text-center gap-6 md:gap-10">
        
        <div className="text-center relative mb-4">
          <div className="absolute inset-x-0 top-0 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-xl rounded-full border-4 border-blue-500/30 mb-4 md:mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-[float_4s_ease-in-out_infinite]">
            <span className="text-4xl md:text-6xl drop-shadow-lg">🤔</span>
          </div>
          <h2 className="text-3xl md:text-7xl font-black text-white tracking-tight mb-4 relative z-10">Who's the Impostor?</h2>
          <p className="text-slate-300 text-sm md:text-xl font-medium max-w-3xl mx-auto relative z-10 leading-relaxed bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/10 backdrop-blur-md">
            Analyze the hints carefully. Once you lock in your vote, you can't change it!
          </p>
        </div>

        {!hasVoted ? (
          <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[3rem] p-4 sm:p-6 md:p-10 shadow-2xl flex flex-col relative overflow-hidden">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12 relative z-10">
              {players.filter(p => p.id !== myPlayerId).map(p => {
                const hint = [...hints].reverse().find(h => h.playerId === p.id)?.hint;
                return (
                  <button 
                    key={p.id}
                    onClick={() => { sounds.click(); setSelectedId(p.id); }}
                    className={`flex flex-col items-start p-4 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all duration-300 text-left active:scale-[0.98] relative overflow-hidden group ${
                      selectedId === p.id 
                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-[1.01]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {selectedId === p.id && (
                       <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center animate-fade-in shadow-lg z-20">
                         <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    )}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        sounds.click(); 
                        setHistoryPlayerId(p.id); 
                      }}
                      className="absolute top-3 left-3 md:top-4 md:left-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/5 transition-all text-slate-400 hover:text-white z-20"
                      title="View Previous Hints"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 shadow-inner transition-colors ${selectedId === p.id ? 'bg-blue-500 border-blue-400' : 'bg-slate-800 border-slate-700'}`}>
                         <span className="text-base md:text-xl font-black text-white">{p.name?.substring(0, 2).toUpperCase() || "??"}</span>
                      </div>
                      <span className={`text-lg md:text-2xl font-black truncate max-w-[150px] transition-colors ${selectedId === p.id ? 'text-white' : 'text-slate-200'}`}>{p.name || "Unknown"}</span>
                    </div>

                    <div className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border transition-colors shadow-inner ${selectedId === p.id ? 'bg-blue-900/40 border-blue-800' : 'bg-slate-950/60 border-white/5'}`}>
                      <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 font-sans ${selectedId === p.id ? 'text-blue-300' : 'text-slate-500'}`}>THEIR HINT</span>
                      <span className="text-lg md:text-2xl font-black italic truncate block text-white capitalize leading-tight">"{hint || '???'}"</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="relative z-10 mx-auto w-full max-w-lg">
              <button 
                onClick={handleVoteClick}
                disabled={!selectedId}
                className="w-full py-4 md:py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black rounded-xl md:rounded-[2rem] shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl disabled:shadow-none disabled:active:scale-100 uppercase tracking-widest border-b-4 border-black/20"
              >
                Lock In Vote
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-teal-500/20 rounded-2xl md:rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl mt-8 md:mt-12 animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none"></div>
            
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_50px_rgba(45,212,191,0.5)] border-4 border-white/20 relative z-10 animate-[float_4s_ease-in-out_infinite]">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg relative z-10">Vote Locked!</h3>
            <p className="text-teal-200/50 text-[10px] md:text-xs uppercase font-black tracking-widest mb-6 relative z-10">Waiting for other players...</p>
            
            {/* Real-time Pending Players List */}
            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 mb-8 max-w-md">
               {pendingPlayers.length > 0 ? (
                 pendingPlayers.map(p => (
                   <div key={p.id} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 animate-pulse transition-all">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <span className="text-sm md:text-lg font-black text-slate-300 uppercase tracking-tight">{p.name}</span>
                   </div>
                 ))
               ) : (
                 <p className="text-teal-400 font-black uppercase tracking-widest">Finishing Round...</p>
               )}
            </div>
            
            <div className="flex gap-3 md:gap-4 relative z-10 bg-slate-950/80 p-5 md:p-6 rounded-full border border-white/5 shadow-inner">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-bounce shadow-[0_0_15px_rgba(59,130,246,0.8)] [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 bg-teal-500 rounded-full animate-bounce shadow-[0_0_15px_rgba(45,212,191,0.8)] [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-bounce shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {historyPlayerId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setHistoryPlayerId(null)}></div>
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-3xl overflow-hidden animate-zoom-in">
              <div className="p-6 md:p-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xl font-black text-blue-400">{historyPlayer?.name?.substring(0, 2).toUpperCase() || "??"}</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white leading-none mb-1">{historyPlayer?.name || "Player"}'s History</h3>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Hint Progression</span>
                  </div>
                </div>
                <button onClick={() => setHistoryPlayerId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {playerHints.length > 0 ? (
                  playerHints.map((h, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-1 transition-all hover:bg-white/10 group">
                      <span className="text-[10px] uppercase font-black tracking-widest text-blue-400/70 group-hover:text-blue-400 transition-colors">Round {idx + 1}</span>
                      <p className="text-lg md:text-xl font-bold text-slate-200 capitalize italic">"{h.hint}"</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600 border border-white/5">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-slate-400 font-bold italic text-lg uppercase tracking-tight">No words yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-950/60 border-t border-white/5">
                <button 
                  onClick={() => setHistoryPlayerId(null)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border-b-4 border-black/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Voting;
