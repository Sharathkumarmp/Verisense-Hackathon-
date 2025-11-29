import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  // REPLACE WITH YOUR ACTUAL TELEGRAM BOT LINK
  const TELEGRAM_BOT_URL = "https://t.me/Verisensebot";

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-white mt-auto py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <ShieldCheck className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            <div className="ml-3">
              <span className="text-2xl font-bold tracking-widest text-slate-800 dark:text-white font-orbitron">VERI<span className="text-cyan-600 dark:text-cyan-400">SENSE</span></span>
              <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Truth Detected.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500">
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Home</a>
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Telegram Bot</a>
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Database</a>
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy</a>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-slate-600 text-xs font-mono">
          <p>&copy; 2025 VeriSense System. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">
            <span>SECURE CONNECTION ESTABLISHED</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;