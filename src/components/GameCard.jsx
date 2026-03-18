import React from 'react';

const GameCard = ({ onClick }) => {
  const handleClick = () => {
    console.log("Impostor Game Clicked");
    if (onClick) onClick();
  };

  return (
    <div className="relative group">
      {/* Outer Glow Ring - Enhanced Green */}
      <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
      
      <button
        onClick={handleClick}
        className="relative flex flex-col items-center justify-center 
                   w-64 h-64 md:w-80 md:h-80 
                   rounded-full bg-slate-900 border-4 border-emerald-500/20
                   shadow-[0_0_50px_rgba(16,185,129,0.1)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                   hover:scale-110 hover:border-emerald-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.4)]
                   active:scale-95 outline-none overflow-hidden"
      >
        {/* Internal Green Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Animation Wrapper for Icon */}
        <div className="text-9xl mb-6 relative z-10 animate-[float_4s_ease-in-out_infinite] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,0.6)]">
          <span role="img" aria-label="Spy" className="inline-block transform group-hover:rotate-12 transition-transform duration-500 drop-shadow-lg">
            🕵️
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h3 className="text-3xl font-black tracking-tight text-emerald-50 group-hover:text-white transition-all duration-300">
            Impostor Game
          </h3>
          <div className="h-1.5 w-12 bg-emerald-500 group-hover:w-32 transition-all duration-500 mt-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </div>
  );
};

export default GameCard;
