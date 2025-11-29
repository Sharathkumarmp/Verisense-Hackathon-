import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClaimForm from './components/ClaimForm';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { MOCK_CLAIMS } from './constants';
import { Claim } from './types';
import { fetchClaimsFromSheet } from './services/sheetService';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  // Default to dark mode to match the original "Retro Space" aesthetic
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [loading, setLoading] = useState(true);
  
  // REPLACE THIS WITH YOUR ACTUAL TELEGRAM BOT LINK
  const TELEGRAM_BOT_URL = "https://t.me/Verisensebot";
  
  // State to control dashboard visibility on the Home tab
  const [showHomeDashboard, setShowHomeDashboard] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load claims from Sheet on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const sheetClaims = await fetchClaimsFromSheet();
      if (sheetClaims.length > 0) {
        setClaims(sheetClaims);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleClaimSubmitted = (newClaim: Claim) => {
    setClaims([newClaim, ...claims]);
    setShowHomeDashboard(true);
  };
  
  const handleSearchReset = () => {
    setShowHomeDashboard(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <ClaimForm onClaimSubmitted={handleClaimSubmitted} onReset={handleSearchReset} />
            {showHomeDashboard && (
              <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                <Dashboard claims={claims} />
              </div>
            )}
          </>
        );
      case 'local-radar':
        return (
          <>
            <Feed claims={claims} />
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
              <Dashboard claims={claims} />
            </div>
          </>
        );
      default:
        return <ClaimForm onClaimSubmitted={handleClaimSubmitted} onReset={handleSearchReset} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-inter overflow-x-hidden transition-colors duration-300">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      
      <main className="flex-grow relative flex flex-col">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        <div className="relative z-10 flex-grow flex flex-col">
          {renderContent()}
        </div>
      </main>
      
      <Footer />

      {/* Telegram Floating Action Button */}
      <a
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <span className="absolute -top-10 right-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
          Chat on Telegram
        </span>
        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] hover:scale-110 transition-all duration-300 border border-cyan-400/50">
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
          <MessageCircle className="w-7 h-7 text-white fill-white/20" />
        </div>
      </a>
    </div>
  );
};

export default App;