import React from 'react';
import GameCard from './GameCard';
import About from './About';
import CreatorCard from './CreatorCard';

const Landing = ({ onStart }) => {
  return (
    <div className="relative w-full overflow-y-auto overflow-x-hidden flex flex-col items-center">
        {/* Main Hero Section / Game Selection */}
        <main className="min-h-[90vh] md:min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12 relative">
          <div className="text-center animate-fade-in relative mb-8 md:mb-12">
            <div className="absolute -inset-x-10 md:-inset-x-20 -inset-y-5 md:-inset-y-10 bg-blue-500/10 blur-[40px] md:blur-[60px] rounded-full pointer-events-none"></div>
            <p className="text-blue-400 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs mb-2 md:mb-3 relative z-10">Select Your Experience</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight relative z-10 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Ready to Play?</h2>
          </div>

          <div className="w-full max-w-sm sm:max-w-md md:max-w-none flex justify-center">
            <GameCard onClick={onStart} />
          </div>

          {/* Scroll for more indicator */}
          <div className="mt-12 md:mt-20 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-default animate-bounce">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-black mb-2 md:mb-3 text-emerald-400">Experience Family Time</span>
            <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
          </div>
        </main>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent"></div>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <About />
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"></div>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <CreatorCard />
        </section>

        <footer className="w-full py-8 md:py-12 flex flex-col items-center gap-4 text-slate-500 font-medium">
          <div className="h-px w-8 md:w-12 bg-slate-800"></div>
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-center px-6">© 2026 Family Time • Built by MONSTER LIAR</p>
        </footer>
      </div>
  );
};

export default Landing;
