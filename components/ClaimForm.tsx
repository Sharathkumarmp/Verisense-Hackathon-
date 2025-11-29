import React, { useState, useRef } from 'react';
import { Loader2, Sparkles, Image, Mic, Plus, Search, CheckCircle, AlertTriangle, ArrowRight, X, FileAudio, FileImage, ExternalLink, Code, AlertOctagon } from 'lucide-react';
import { verifyClaimWithGemini } from '../services/geminiService';
import { VerificationStatus, Claim, City } from '../types';

interface ClaimFormProps {
  onClaimSubmitted: (claim: Claim) => void;
  onReset?: () => void;
}

type AnalysisStep = 'Initializing' | 'Scanning Vector DB' | 'Analyzing Sentiment' | 'Cross-referencing Sources' | 'Finalizing Verdict';

const ClaimForm: React.FC<ClaimFormProps> = ({ onClaimSubmitted, onReset }) => {
  const [text, setText] = useState('');
  const [viewState, setViewState] = useState<'search' | 'thinking' | 'result' | 'error'>('search');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [result, setResult] = useState<Claim | null>(null);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<AnalysisStep>('Initializing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAudioAlert, setShowAudioAlert] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hardcoded defaults since inputs were removed
  const defaultCity = City.All;
  const defaultSource = "User Input";

  const steps: AnalysisStep[] = [
    'Scanning Vector DB', 
    'Analyzing Sentiment', 
    'Cross-referencing Sources', 
    'Finalizing Verdict'
  ];

  const handleMediaClick = (type: 'image' | 'audio') => {
    setShowMediaMenu(false);

    if (type === 'audio') {
      setShowAudioAlert(true);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    // Reset the value so the same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const simulateThinking = async () => {
    setViewState('thinking');
    
    for (const step of steps) {
        setThinkingStep(step);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    await simulateThinking();

    try {
      const analysis = await verifyClaimWithGemini(text, defaultCity, defaultSource, selectedFile);
      
      const newClaim: Claim = {
        id: Date.now().toString(),
        text: text || (selectedFile ? `[Analyzed ${selectedFile.name}]` : 'Empty Query'),
        source: analysis.source || defaultSource,
        city: defaultCity,
        area: 'General',
        status: analysis.status,
        explanation: analysis.explanation,
        confidenceScore: analysis.confidence,
        timestamp: Date.now(),
        attachmentType: selectedFile?.type.startsWith('image/') ? 'image' : selectedFile?.type.startsWith('audio/') ? 'audio' : undefined,
        attachmentName: selectedFile?.name,
        rawAnalysis: analysis.rawResponse // Store for debugging
      };

      setResult(newClaim);
      onClaimSubmitted(newClaim);
      setViewState('result');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unknown error occurred");
      setViewState('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.Verified: return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]';
      case VerificationStatus.False: return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]';
      case VerificationStatus.Misleading: return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  // --------------------------------------------------------------------------
  // VIEW: ERROR
  // --------------------------------------------------------------------------
  if (viewState === 'error') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] w-full px-4">
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-2xl max-w-lg w-full text-center">
                <AlertOctagon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Analysis Failed</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{errorMessage}</p>
                <button 
                  onClick={() => setViewState('search')}
                  className="px-6 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                    Try Again
                </button>
             </div>
        </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: THINKING
  // --------------------------------------------------------------------------
  if (viewState === 'thinking') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] w-full">
         <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 p-8 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <Loader2 className="h-16 w-16 text-cyan-600 dark:text-cyan-400 animate-spin" />
            </div>
         </div>
         <h2 className="mt-8 text-2xl font-bold font-orbitron text-slate-800 dark:text-white tracking-widest animate-pulse">
            SYSTEM ANALYZING
         </h2>
         <div className="mt-4 flex flex-col items-center space-y-2">
            <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">
               [{thinkingStep}...]
            </span>
            <div className="w-64 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
               <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
         </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: RESULT
  // --------------------------------------------------------------------------
  if (viewState === 'result' && result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] w-full px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
         <div className="w-full max-w-3xl">
            {/* Header / Back */}
            <div className="mb-8 text-center">
               <h3 className="text-slate-500 font-orbitron text-xs uppercase tracking-[0.3em] mb-2">Analysis Complete</h3>
               <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
            </div>

            {/* Main Result Card */}
            <div className={`p-8 rounded-2xl border ${getStatusColor(result.status)} backdrop-blur-xl relative overflow-hidden group`}>
               {/* Background Elements */}
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  {result.status === VerificationStatus.Verified ? <CheckCircle className="w-64 h-64" /> : <AlertTriangle className="w-64 h-64" />}
               </div>

               <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-shrink-0">
                     <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 ${
                        result.status === VerificationStatus.Verified ? 'border-emerald-500/50 bg-emerald-100 dark:bg-emerald-900/20' : 
                        result.status === VerificationStatus.False ? 'border-red-500/50 bg-red-100 dark:bg-red-900/20' : 
                        'border-amber-500/50 bg-amber-100 dark:bg-amber-900/20'
                     }`}>
                        {result.status === VerificationStatus.Verified ? (
                           <CheckCircle className={`h-8 w-8 ${result.status === VerificationStatus.Verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                        ) : (
                           <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        )}
                     </div>
                  </div>
                  
                  <div className="flex-grow">
                     <div className="flex justify-between items-start mb-2">
                        <h2 className="text-3xl font-black font-orbitron tracking-wide uppercase text-slate-900 dark:text-white">{result.status}</h2>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded">
                           CONF: {(result.confidenceScore! * 100).toFixed(0)}%
                        </span>
                     </div>
                     <div className="text-lg text-slate-700 dark:text-slate-100 font-light leading-relaxed mb-6 whitespace-pre-wrap">
                        {result.explanation}
                     </div>
                     
                     {result.source && result.source.startsWith('http') && (
                        <div className="mb-6">
                            <a 
                                href={result.source} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Verify Source
                            </a>
                        </div>
                     )}
                     
                     <div className="bg-slate-100 dark:bg-slate-950/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Input Query</span>
                        <p className="text-slate-600 dark:text-slate-300 italic mb-2">"{result.text}"</p>
                        {result.attachmentName && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 w-fit">
                                {result.attachmentType === 'image' ? <FileImage className="h-3 w-3" /> : <FileAudio className="h-3 w-3" />}
                                {result.attachmentName}
                            </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Debug Expander */}
            <div className="mt-4">
                 <details className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <summary className="px-4 py-2 cursor-pointer text-xs font-mono text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-2 outline-none">
                        <Code className="h-3 w-3" />
                        🕵‍♂ Raw N8N Response (Debug)
                    </summary>
                    <div className="p-4 bg-slate-200 dark:bg-black/50 overflow-x-auto">
                        <pre className="text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                            {JSON.stringify(result.rawAnalysis, null, 2)}
                        </pre>
                    </div>
                 </details>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
               <button 
                  onClick={() => {
                     setResult(null);
                     setText('');
                     setSelectedFile(null);
                     setViewState('search');
                     if (onReset) onReset();
                  }}
                  className="group relative px-8 py-3 bg-white dark:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-600 dark:text-cyan-400 font-bold font-orbitron tracking-wider uppercase transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
               >
                  <span className="absolute inset-0 w-full h-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="flex items-center gap-2">
                     <Search className="w-4 h-4" />
                     New Investigation
                  </span>
               </button>
            </div>
         </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: SEARCH (Default)
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full relative">
      
      {/* Audio Unavailable Modal */}
      {showAudioAlert && (
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
                        onClick={() => setShowAudioAlert(false)}
                        className="w-full py-3 bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center px-4 -mt-20">
         
         {/* Logo / Title */}
         <div className="mb-10 text-center animate-in fade-in zoom-in duration-700">
             <div className="inline-flex items-center justify-center p-4 bg-white/50 dark:bg-slate-900/80 rounded-full border border-cyan-200 dark:border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] mb-6">
                <Sparkles className="h-10 w-10 text-cyan-500 dark:text-cyan-400" />
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white font-orbitron tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                VERI<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">SENSE</span>
             </h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-mono tracking-[0.2em] uppercase opacity-80">
                Advanced Misinformation Detection System
             </p>
         </div>

         {/* Centered Search Bar */}
         <div className="w-full max-w-2xl relative z-20 group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>
            
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-2xl flex flex-col p-2 transition-all group-hover:border-cyan-500/50">
               
               {/* Hidden File Input */}
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange} 
               />
               
               <div className="flex items-center">
                  {/* Search Icon */}
                  <div className="pl-4 pr-3">
                     <Search className="h-6 w-6 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <div className="flex-grow flex flex-col justify-center min-h-[3rem]">
                      {/* Selected File Chip */}
                      {selectedFile && (
                          <div className="flex items-center gap-2 mb-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit animate-in fade-in slide-in-from-bottom-2 mx-3 mt-1">
                              {selectedFile.type.startsWith('image/') ? (
                                  <FileImage className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                              ) : (
                                  <FileAudio className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )}
                              <span className="text-xs font-mono text-slate-600 dark:text-slate-300 max-w-[150px] truncate">
                                  {selectedFile.name}
                              </span>
                              <button 
                                  onClick={clearFile}
                                  className="ml-1 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                              >
                                  <X className="h-3 w-3 text-slate-500 hover:text-red-500" />
                              </button>
                          </div>
                      )}

                      {/* Text Input */}
                      <textarea
                         value={text}
                         onChange={(e) => setText(e.target.value)}
                         onKeyDown={handleKeyDown}
                         placeholder="Paste rumor, news, or claim to verify..."
                         className="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-lg px-3 py-2 focus:outline-none resize-none custom-scrollbar font-light w-full"
                         rows={1}
                         style={{ minHeight: '3rem', maxHeight: '150px' }}
                      />
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center gap-2 pr-2">
                     
                     {/* Plus Menu */}
                     <div className="relative">
                        <button 
                           onClick={() => setShowMediaMenu(!showMediaMenu)}
                           className={`p-2 rounded-full transition-colors ${showMediaMenu ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}`}
                        >
                           <Plus className={`h-6 w-6 transition-transform duration-300 ${showMediaMenu ? 'rotate-45' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {showMediaMenu && (
                           <div className="absolute bottom-full right-0 mb-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
                              <button onClick={() => handleMediaClick('image')} className="w-full px-4 py-3 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-3 transition-colors border-b border-slate-100 dark:border-slate-800">
                                 <Image className="h-4 w-4" /> Upload Image
                              </button>
                              <button onClick={() => handleMediaClick('audio')} className="w-full px-4 py-3 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-3 transition-colors">
                                 <Mic className="h-4 w-4" /> Upload Audio
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Submit Button */}
                     <button
                        onClick={() => handleSubmit()}
                        disabled={!text.trim() && !selectedFile}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                           text.trim() || selectedFile
                              ? 'bg-cyan-500 text-white dark:text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                     >
                        <ArrowRight className="h-5 w-5" />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Footer hint */}
         <div className="mt-8 text-slate-500 dark:text-slate-600 text-xs font-mono flex gap-6">
            <span className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-500/70 transition-colors cursor-pointer">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
               Supports Text
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-500/70 transition-colors cursor-pointer">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
               Supports Images
            </span>
            <span className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-500/70 transition-colors cursor-pointer">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></div>
               Supports Audio
            </span>
         </div>
      </div>
    </div>
  );
};

export default ClaimForm;