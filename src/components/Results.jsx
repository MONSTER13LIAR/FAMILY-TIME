import React, { useState, useEffect } from 'react';
import PlayerList from './PlayerList';

const Results = ({ players, impostorId, word, votes, pointGains, isHost, isTie, hasMajority, topVoteCount, totalVotes, onNextRound, onExitRoom, onRemoveBot, roundEnded }) => {
  const impostor = players.find(p => p.id === impostorId);
  
  // Tally votes
  const voteCounts = {};
  Object.values(votes).forEach(votedId => {
    voteCounts[votedId] = (voteCounts[votedId] || 0) + 1;
  });
  
  // Server already determined outcome — derive locally for colour only
  const impostorVotes = impostorId ? (voteCounts[impostorId] || 0) : 0;
  const impostorVotedOut = hasMajority && !isTie && impostorVotes === topVoteCount && impostorVotes > totalVotes / 2;
  const impostorWins = !impostorVotedOut;

  // Outcome label
  let outcomeEmoji, outcomeTitle, outcomeSubtitle;
  if (isTie) {
    outcomeEmoji = '🤝';
    outcomeTitle = "It's a Tie!";
    outcomeSubtitle = `The Impostor received some votes but was not caught!`;
  } else if (impostorVotedOut) {
    outcomeEmoji = '🎉';
    outcomeTitle = 'Players Win!';
    outcomeSubtitle = `The Impostor got ${impostorVotes}/${totalVotes} votes — majority reached!`;
  } else {
    outcomeEmoji = '😈';
    outcomeTitle = 'Impostor Wins!';
    outcomeSubtitle = impostorVotes === 0 
      ? "Perfect victory! No one even suspected the Impostor."
      : "Not enough votes on the Impostor — they slipped away!";
  }

  // Render Full Results
  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-6 pt-24 pb-12 relative animate-fade-in z-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
        
        {/* Outcome Card */}
        <div className={`w-full flex flex-col items-center text-center p-8 md:p-16 rounded-3xl md:rounded-[3.5rem] border-2 md:border-4 shadow-2xl relative overflow-hidden transition-all duration-1000 ${
          impostorWins 
            ? 'bg-rose-950/20 border-rose-900/50 shadow-[0_0_100px_rgba(225,29,72,0.2)]' 
            : 'bg-emerald-950/20 border-emerald-900/50 shadow-[0_0_100px_rgba(16,185,129,0.2)]'
        }`}>
           <div className={`absolute inset-0 bg-gradient-to-t opacity-30 ${impostorWins ? 'from-rose-900 to-transparent' : 'from-emerald-900 to-transparent'}`}></div>
           
           <span className="text-6xl md:text-8xl mb-6 md:mb-8 relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-bounce">{outcomeEmoji}</span>
           <h2 className={`text-4xl md:text-8xl font-black text-white tracking-tighter uppercase mb-4 relative z-10 drop-shadow-2xl ${impostorWins ? 'bg-gradient-to-b from-white to-rose-400' : 'bg-gradient-to-b from-white to-emerald-400'} bg-clip-text text-transparent`}>
             {outcomeTitle}
           </h2>
           <p className="text-slate-300 text-sm md:text-xl font-bold mb-8 md:mb-12 relative z-10 bg-slate-950/40 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-3xl border border-white/5 backdrop-blur-sm max-w-2xl">{outcomeSubtitle}</p>
           
           <div className="bg-slate-950/60 backdrop-blur-xl px-6 py-5 md:px-12 md:py-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 mb-8 md:mb-12 w-full max-w-xl mx-auto flex flex-col items-center gap-3 md:gap-4">
             <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">THE IMPOSTOR WAS</span>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-rose-900 to-slate-900 flex items-center justify-center border-2 border-rose-500/30 shadow-xl">
                <span className="text-xl md:text-2xl font-black text-rose-100">{impostor?.name?.substring(0, 2).toUpperCase() || "..."}</span>
              </div>
              <span className="text-3xl md:text-5xl font-black text-rose-500 tracking-tight drop-shadow-[0_0_15px_rgba(225,29,72,0.4)] uppercase">{impostor?.name || "The Impostor"}</span>
            </div>
           </div>

           <div className="inline-flex flex-col items-center px-8 py-4 md:px-12 md:py-6 bg-slate-950/80 rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-3xl relative z-10 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all w-full sm:w-auto">
             <span className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-[0.4em] block mb-2 md:mb-3">THE SECRET WORD</span>
             <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.2em]">{word}</span>
           </div>
        </div>

        <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl flex flex-col relative overflow-hidden mb-12">
          <h3 className="text-xl md:text-3xl font-black text-white mb-6 md:mb-10 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 md:gap-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
            Scoreboard
          </h3>
          
          <div className="relative z-10 w-full mb-8 md:mb-12">
            <PlayerList 
              players={players} 
              myPlayerId={null}
              onRemoveBot={onRemoveBot}
            >
              {(player) => {
                const votedId = votes[player.id];
                const votedFor = votedId ? players.find(p => p.id === votedId)?.name : null;
                const gain = pointGains?.[player.id];
                return (
                  <div className="flex flex-col gap-2">
                    {gain && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${gain.points > 10 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-teal-500/20 text-teal-400 border border-teal-500/20'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                          +{gain.points} {gain.reason}
                        </span>
                      </div>
                    )}
                    {votedFor && (
                      <div className="text-[10px] md:text-xs text-slate-400 font-black bg-slate-950/50 p-2 md:p-3 rounded-xl border border-white/5 uppercase tracking-widest flex items-center gap-2">
                        <span className="shrink-0 opacity-50">Voted for</span>
                        <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        <span className="text-white truncate">{votedFor}</span>
                      </div>
                    )}
                  </div>
                );
              }}
            </PlayerList>
          </div>
          
          <div className="mt-4 md:mt-8 pt-6 md:pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto relative z-10">
            {isHost ? (
               <button 
                 onClick={onNextRound}
                 disabled={!roundEnded}
                 className={`w-full sm:w-auto px-10 md:px-20 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-black uppercase tracking-widest rounded-xl md:rounded-full shadow-2xl transition-all duration-300 active:scale-95 text-lg md:text-2xl border-b-4 border-black/20`}
               >
                 Next Round
               </button>
            ) : (
               <div className="w-full sm:flex-1 py-4 md:py-6 px-8 md:px-12 bg-white/5 text-slate-500 font-black uppercase tracking-widest rounded-xl md:rounded-full border border-white/5 text-sm md:text-xl animate-pulse text-center">
                 Waiting for host...
               </div>
            )}
            
            <button 
              onClick={onExitRoom}
              className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-5 bg-slate-800/50 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 font-black uppercase tracking-widest rounded-xl md:rounded-full border border-white/10 hover:border-rose-500/50 transition-all duration-300 active:scale-95 text-sm md:text-lg"
            >
              Exit Game
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
