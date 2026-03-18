import React from 'react';

const CreatorCard = () => {
  return (
    <section className="w-full max-w-2xl px-6 py-20 animate-[fadeIn_1s_ease-out_forwards] [animation-delay:200ms]">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
          {/* Avatar / Initials */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-1 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
                {/* Red Iris */}
                <circle cx="50" cy="50" r="48" fill="#e11d48" />
                {/* Outer Ring */}
                <circle cx="50" cy="50" r="48" fill="none" stroke="#000" strokeWidth="2" />
                {/* Tomoe Track */}
                <circle cx="50" cy="50" r="28" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
                {/* Pupil */}
                <circle cx="50" cy="50" r="9" fill="#000" />
                
                {/* Tomoe 1 */}
                <g transform="rotate(0, 50, 50) translate(50, 22)">
                  <circle cx="0" cy="0" r="5.5" fill="#000" />
                  <path d="M 5,0 C 5,-10 -5,-10 -5,0" fill="#000" transform="rotate(40)" />
                </g>
                
                {/* Tomoe 2 */}
                <g transform="rotate(120, 50, 50) translate(50, 22)">
                  <circle cx="0" cy="0" r="5.5" fill="#000" />
                  <path d="M 5,0 C 5,-10 -5,-10 -5,0" fill="#000" transform="rotate(40)" />
                </g>
                
                {/* Tomoe 3 */}
                <g transform="rotate(240, 50, 50) translate(50, 22)">
                  <circle cx="0" cy="0" r="5.5" fill="#000" />
                  <path d="M 5,0 C 5,-10 -5,-10 -5,0" fill="#000" transform="rotate(40)" />
                </g>
              </svg>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            Monster Liar
          </h2>
          
          <p className="text-slate-400 text-lg mb-10 font-medium">
            Building fun, creative, and AI-powered web experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full">
            <a 
              href="https://github.com/MONSTER13LIAR" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 group/btn active:scale-95"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>

            <a 
              href="https://x.com/MONSTER13LIAR" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Follow on X
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCard;
