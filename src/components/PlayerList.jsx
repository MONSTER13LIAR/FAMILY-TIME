import React from 'react';

const PlayerList = ({ players, myPlayerId, highlightId, children }) => {
  const scores = players.map(p => p.score || 0);
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
      {players.map(player => {
        const isLeader = maxScore > 0 && player.score === maxScore;
        return (
          <div 
            key={player.id} 
            className={`relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
              highlightId === player.id 
                ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02] z-10' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            {highlightId === player.id && (
               <div className="absolute inset-x-0 -top-1 h-full w-full bg-blue-400/5 blur-xl rounded-full"></div>
            )}

            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border-2 shadow-inner shrink-0 relative z-10 ${isLeader ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'border-slate-600'}`}>
              <span className={`text-base sm:text-xl font-black ${isLeader ? 'text-amber-400' : 'text-white'}`}>{player.name?.substring(0, 2).toUpperCase() || "??"}</span>
            </div>

            <div className="flex flex-col flex-1 relative z-10 overflow-hidden min-w-0">
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <span className={`font-bold text-sm sm:text-base truncate max-w-full ${myPlayerId === player.id ? 'text-blue-400' : 'text-slate-200'} ${isLeader ? 'text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]' : ''}`}>
                  {player.name}
                </span>
                {isLeader && (
                  <span className="px-1.5 py-0.5 bg-amber-400 text-black text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-500/50 shrink-0">Leader</span>
                )}
                {player.isHost && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-500/30 shrink-0">Host</span>
                )}
                {player.isBot && (
                  <span className="px-1.5 py-0.5 bg-slate-600/30 text-slate-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-slate-600/50 shrink-0">Bot</span>
                )}
                {player.isPlayingThisRound === false && (
                  <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-rose-500/30 shrink-0">Specs</span>
                )}
              </div>
              {myPlayerId === player.id && (
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-widest leading-none">You</span>
              )}
              {children && children(player)}
            </div>
            
            {player.score !== undefined && (
               <div className={`flex flex-col items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border relative z-10 shrink-0 ${isLeader ? 'bg-amber-950/40 border-amber-500/50' : 'bg-slate-900/80 border-slate-700'}`}>
                 <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isLeader ? 'text-amber-500/80' : 'text-slate-500'}`}>Pts</span>
                 <span className={`font-black text-base sm:text-lg leading-none ${isLeader ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-emerald-400'}`}>{player.score}</span>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
