import React from 'react';

const About = () => {
  return (
    <section className="w-full max-w-4xl px-6 py-20 animate-[fadeIn_1s_ease-out_forwards]">
      <div className="relative group">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
            About Family Time
          </h2>
          
          <div className="space-y-6 text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
            <p>
              Family Time is a simple and fun online multiplayer game designed to bring people together.
            </p>
            
            <p className="border-l-4 border-emerald-500/50 pl-6 py-2 bg-emerald-500/5 rounded-r-lg shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              In the Impostor Game, every player receives the same secret word — except one player, the impostor. The impostor must observe others and try to blend in without knowing the word.
            </p>
            
            <p>
              Each player gives a one-word hint in turns. After all players have played, everyone votes to find the impostor.
            </p>
            
            <p className="text-emerald-400/90 font-semibold">
              If the impostor survives, they win. If players guess correctly, they win.
            </p>
            
            <p className="pt-4 border-t border-slate-800 text-slate-400 italic text-base">
              More exciting games will be added soon, making Family Time a growing platform for fun and social gameplay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
