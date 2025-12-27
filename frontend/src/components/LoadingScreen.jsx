import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/95 backdrop-blur-xl transition-opacity duration-500">
      
      {/* Container */}
      <div className="relative flex items-center justify-center scale-75 md:scale-100">
        
        {/* Render the 9 Bars (Loader) */}
        <div className="loaders flex items-center justify-center">
          {[...Array(9)].map((_, i) => (
            <div key={`bar-${i}`} className="loader"></div>
          ))}
        </div>

        {/* Render the 9 Balls (LoaderB) */}
        <div className="loadersB flex items-center justify-center absolute inset-0">
          {[...Array(9)].map((_, i) => (
            <div key={`ball-container-${i}`} className="loaderA">
              <div className={`ball ball${i}`}></div>
            </div>
          ))}
        </div>
        
      </div>

      <div className="absolute bottom-20 text-cyan-400 font-bold tracking-[0.3em] animate-pulse text-lg uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
        Initializing Secure Connection...
      </div>

      <style>{`
        /* --- TAILWIND THEME INTEGRATION --- */
        :root {
          /* Darker, metallic bars */
          --bar-bg: #111827; 
          --bar-border: #374151;
          
          /* NEON COLORS */
          --ball-color: #00f3ff; /* Neon Cyan */
          --ball-glow: #ffffff;  /* White hot center */
        }

        .loader {
          position: absolute;
          width: 1.15em;
          height: 13em;
          border-radius: 50px;
          background: var(--bar-bg);
          box-shadow: 0 0 20px rgba(0,0,0,0.8);
        }
        
        .loader:after, .loader:before {
          content: "";
          position: absolute;
          width: 1.15em;
          height: 5em;
          background: var(--bar-bg);
          border-radius: 50px;
          border: 1px solid var(--bar-border);
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.05);
        }

        .loader:after {
          left: 0; top: 0;
          mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
        }
        
        .loader:before {
          bottom: 0; right: 0;
          height: 4.5em;
          mask-image: linear-gradient(to top, black calc(100% - 48px), transparent 100%);
        }

        .loaderA {
          position: absolute;
          width: 1.15em;
          height: 13em;
          border-radius: 50px;
          background: transparent;
        }

        .ball {
          width: 1.15em;
          height: 1.15em;
          border-radius: 50%;
          background-color: var(--ball-color);
          box-shadow: 
            0 0 10px var(--ball-color),
            0 0 20px var(--ball-color),
            0 0 40px var(--ball-glow),
            inset 2px 2px 5px rgba(255,255,255,1);
          transition: transform 800ms cubic-bezier(1, -0.4, 0, 1.4);
          /* Duration is 3.63s, so we must wait ~3.7s in parent to see full cycle */
          animation: 3.63s move ease-in-out infinite;
        }

        /* --- ROTATIONS --- */
        .loader:nth-child(2), .loaderA:nth-child(2) { transform: rotate(20deg); }
        .loader:nth-child(3), .loaderA:nth-child(3) { transform: rotate(40deg); }
        .loader:nth-child(4), .loaderA:nth-child(4) { transform: rotate(60deg); }
        .loader:nth-child(5), .loaderA:nth-child(5) { transform: rotate(80deg); }
        .loader:nth-child(6), .loaderA:nth-child(6) { transform: rotate(100deg); }
        .loader:nth-child(7), .loaderA:nth-child(7) { transform: rotate(120deg); }
        .loader:nth-child(8), .loaderA:nth-child(8) { transform: rotate(140deg); }
        .loader:nth-child(9), .loaderA:nth-child(9) { transform: rotate(160deg); }

        /* --- DELAYS --- */
        .ball1 { animation-delay: 0.2s; }
        .ball2 { animation-delay: 0.4s; }
        .ball3 { animation-delay: 0.6s; }
        .ball4 { animation-delay: 0.8s; }
        .ball5 { animation-delay: 1s; }
        .ball6 { animation-delay: 1.2s; }
        .ball7 { animation-delay: 1.4s; }
        .ball8 { animation-delay: 1.6s; }

        @keyframes move {
          0% { transform: translateY(0em) scale(1); filter: brightness(1); }
          50% { transform: translateY(12em) scale(1.1); filter: brightness(1.5); }
          100% { transform: translateY(0em) scale(1); filter: brightness(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;