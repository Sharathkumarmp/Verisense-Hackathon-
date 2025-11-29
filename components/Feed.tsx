import React, { useState } from 'react';
import { Search, MapPin, Clock, Filter, Activity, ChevronDown, ExternalLink, ShieldAlert, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import { Claim, VerificationStatus, City } from '../types';

interface FeedProps {
  claims: Claim[];
}

const Feed: React.FC<FeedProps> = ({ claims }) => {
  const [filterCity, setFilterCity] = useState<string>(City.All);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTestingAlert, setShowTestingAlert] = useState(false);

  const filteredClaims = claims.filter(claim => {
    // Loose comparison for City to handle both Enum and string values from CSV
    const matchesCity = filterCity === City.All || (claim.city && claim.city.toString().includes(filterCity === City.All ? '' : filterCity));
    const matchesStatus = filterStatus === 'All' || claim.status === filterStatus;
    const matchesSearch = claim.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (claim.city && claim.city.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCity && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    const styles = {
      [VerificationStatus.Verified]: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-500/50",
      [VerificationStatus.False]: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-500/50",
      [VerificationStatus.Misleading]: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-500/50",
      [VerificationStatus.Pending]: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
    };

    const icons = {
        [VerificationStatus.Verified]: <ShieldCheck className="w-3 h-3 mr-1" />,
        [VerificationStatus.False]: <ShieldAlert className="w-3 h-3 mr-1" />,
        [VerificationStatus.Misleading]: <ShieldAlert className="w-3 h-3 mr-1" />,
        [VerificationStatus.Pending]: <HelpCircle className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles[VerificationStatus.Pending]}`}>
        {icons[status] || icons[VerificationStatus.Pending]}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      
      {/* Testing Phase Alert Modal */}
      {showTestingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-black/50 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-500/30">
                        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-orbitron tracking-wide mb-2">Feature Unavailable</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        Under testing phase. Please visit later.
                    </p>
                    <button 
                        onClick={() => setShowTestingAlert(false)}
                        className="w-full py-3 bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-orbitron tracking-wide flex items-center">
            <Activity className="mr-3 text-cyan-600 dark:text-cyan-400" />
            COMMUNITY FEED
        </h2>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
             {['All', VerificationStatus.Verified, VerificationStatus.False, VerificationStatus.Misleading].map((status) => (
                 <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                        filterStatus === status 
                        ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                        : 'bg-transparent text-slate-500 dark:text-slate-500 border-slate-300 dark:border-slate-700 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/30'
                    }`}
                 >
                     {status}
                 </button>
             ))}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white/50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 relative">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
                type="text"
                readOnly
                onClick={() => setShowTestingAlert(true)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-colors cursor-pointer"
                placeholder="SEARCH DATABASE..."
                value={searchTerm}
                // onChange handler kept but input is readOnly, interactivity blocked by onClick
            />
        </div>
        <div className="relative min-w-[220px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <select
                className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm appearance-none cursor-pointer"
                value={filterCity}
                onMouseDown={(e) => {
                    e.preventDefault();
                    setShowTestingAlert(true);
                }}
            >
                {Object.values(City).sort().map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClaims.map((claim) => (
          <div key={claim.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
            
            {/* Header: Status Badge + City */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
               {getStatusBadge(claim.status)}
               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {claim.city || "N/A"}
               </span>
            </div>

            {/* Body: Claim Text */}
            <div className="p-6 flex-grow">
              <p className="text-slate-900 dark:text-white font-bold text-lg leading-snug">
                "{claim.text}"
              </p>
            </div>

            {/* Footer: Expander "View Verification" */}
            <div className="border-t border-slate-200 dark:border-slate-800">
                <details className="group">
                    <summary className="flex items-center justify-between px-6 py-3 cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-500 uppercase tracking-widest">
                            View Verification
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4">
                        
                        {/* English Truth */}
                        <div className="text-sm">
                            <strong className="block text-slate-700 dark:text-slate-300 mb-1">🇬🇧 Truth:</strong>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {claim.truthEnglish || "N/A"}
                            </p>
                        </div>

                        {/* Native Explanation */}
                        <div className="text-sm">
                             <strong className="block text-slate-700 dark:text-slate-300 mb-1">🇮🇳 Native:</strong>
                             <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {claim.debunkNative || "N/A"}
                             </p>
                        </div>

                        {/* Source Link */}
                        {claim.source && claim.source !== "N/A" && (
                            <div className="pt-2">
                                <a 
                                    href={claim.source} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                                >
                                    <ExternalLink className="h-3 w-3 mr-1.5" />
                                    Source Evidence
                                </a>
                            </div>
                        )}

                        {/* Date Caption */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono text-right flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(claim.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                </details>
            </div>

          </div>
        ))}

        {filteredClaims.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white/50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-700">
                <Search className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">No matching records</h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default Feed;