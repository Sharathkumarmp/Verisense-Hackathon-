import React from 'react';
import { ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'VERIFY' },
    { id: 'local-radar', label: 'LOCAL RADAR' },
  ];

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-cyan-900/50 sticky top-0 z-50 shadow-sm dark:shadow-cyan-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="relative">
              <ShieldCheck className="h-9 w-9 text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            </div>
            <span className="ml-3 text-2xl font-bold text-slate-800 dark:text-white tracking-widest font-orbitron group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              VERI<span className="text-cyan-600 dark:text-cyan-400">SENSE</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 text-sm font-bold tracking-wider transition-all duration-200 font-orbitron rounded-md ${
                  activeTab === item.id
                    ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="flex items-center space-x-3 ml-6 border-l pl-6 border-slate-300 dark:border-slate-700">
              <button
                onClick={toggleTheme}
                className={`relative inline-flex items-center p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  isDarkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-200 text-orange-500'
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-cyan-400 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-bold tracking-wide font-orbitron ${
                  activeTab === item.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-300'
                }`}
              >
                {item.label}
              </button>
            ))}
             <div className="flex items-center justify-between px-3 py-4 mt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wider">THEME</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-cyan-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;