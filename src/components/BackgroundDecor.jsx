import React from 'react';

const BackgroundDecor = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Main gradient background — blue to teal to white-ish */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/80 to-teal-950/60"></div>
      
      {/* Soft glowing orbs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `radial-gradient(circle, #60a5fa 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>
    </div>
  );
};

export default BackgroundDecor;
