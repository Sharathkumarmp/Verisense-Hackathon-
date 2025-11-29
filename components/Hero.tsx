import React from 'react';
import { Zap, MapPin, Globe } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
            System Online
          </div>
          <h1 className="text-5xl tracking-tight font-black text-white sm:text-6xl md:text-7xl font-orbitron drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="block mb-2">VERISENSE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              TRUTH DETECTED
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400 sm:text-xl md:mt-8 md:max-w-3xl leading-relaxed">
            Advanced agentic AI for misinformation detection. Scanning Mumbai, Cochin, and Coimbatore sectors for truth verification.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-6">
            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center px-8 py-4 border border-cyan-400 text-base font-bold rounded-none skew-x-[-10deg] text-slate-900 bg-cyan-400 hover:bg-cyan-300 md:text-lg md:w-auto shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-1"
            >
              <span className="skew-x-[10deg]">INITIATE SCAN</span>
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 w-full flex items-center justify-center px-8 py-4 border border-slate-600 text-base font-bold rounded-none skew-x-[-10deg] text-cyan-400 bg-slate-900/50 hover:bg-slate-800 hover:border-cyan-500/50 md:mt-0 md:text-lg md:w-auto shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm"
            >
              <span className="skew-x-[10deg]">SYSTEM DATA</span>
            </button>
          </div>
        </div>

        {/* Stats Preview Grid */}
        <div className="mt-24 max-w-5xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 text-center relative group hover:border-cyan-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
            
            <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-orbitron">Claims Verified</dt>
            <dd className="text-4xl font-black text-white font-orbitron tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">1,247</dd>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 text-center relative group hover:border-cyan-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>

            <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-orbitron">Sectors Active</dt>
            <dd className="text-4xl font-black text-white font-orbitron tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">3</dd>
          </div>
          
           <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 text-center relative group hover:border-cyan-500/50 transition-colors">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>

            <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-orbitron">Accuracy Rate</dt>
            <dd className="text-4xl font-black text-cyan-400 font-orbitron tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">94%</dd>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-28 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="relative bg-slate-900/40 p-8 border border-slate-800 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="absolute -top-6 left-6 bg-slate-900 border border-slate-700 rounded-none skew-x-[-10deg] p-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 transition-colors">
              <Zap className="h-6 w-6 text-cyan-400 skew-x-[10deg]" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white tracking-wide font-orbitron">INSTANT ANALYSIS</h3>
            <p className="mt-3 text-base text-slate-400 leading-relaxed">
              Neural networks analyze claims in milliseconds. Rapid fact-checking protocol engaged for all incoming data streams.
            </p>
          </div>

          <div className="relative bg-slate-900/40 p-8 border border-slate-800 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="absolute -top-6 left-6 bg-slate-900 border border-slate-700 rounded-none skew-x-[-10deg] p-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 transition-colors">
              <MapPin className="h-6 w-6 text-blue-400 skew-x-[10deg]" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white tracking-wide font-orbitron">SECTOR LOCKED</h3>
            <p className="mt-3 text-base text-slate-400 leading-relaxed">
              Hyper-local context awareness for Mumbai, Cochin, and Coimbatore. Specialized datasets for target zones.
            </p>
          </div>

          <div className="relative bg-slate-900/40 p-8 border border-slate-800 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="absolute -top-6 left-6 bg-slate-900 border border-slate-700 rounded-none skew-x-[-10deg] p-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 transition-colors">
              <Globe className="h-6 w-6 text-purple-400 skew-x-[10deg]" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white tracking-wide font-orbitron">MULTI-LINGUAL</h3>
            <p className="mt-3 text-base text-slate-400 leading-relaxed">
              Universal translator active. Processing English, Hindi, Malayalam, Tamil, and Marathi input vectors.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;