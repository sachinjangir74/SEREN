import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children?: ReactNode }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State { 
    return { hasError: true, error }; 
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error('Caught error:', error, errorInfo);
    
    // Auto-reload for Vercel/Vite chunk loading errors (new deployments)
    const isChunkLoadFailed = error.message.includes('Failed to fetch dynamically imported module') || error.name === 'ChunkLoadError' || error.message.includes('Importing a module script failed');
    
    if (isChunkLoadFailed) {
       const chunkFailedKey = 'chunk_failed_reload';
       if (!sessionStorage.getItem(chunkFailedKey)) {
          sessionStorage.setItem(chunkFailedKey, 'true');
          window.location.reload();
          return;
       }
    }
  }

  componentDidMount() {
    // Clear flag on successful load hook
    window.addEventListener('load', () => {
        sessionStorage.removeItem('chunk_failed_reload');
    });
  }

  render() { 
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-center w-full">
           <div className="max-w-md bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 space-y-4 w-full">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Connection Interrupted</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                We've recently pushed an update to SEREN! Please reload the page to apply the latest improvements.
              </p>
              <button 
                onClick={() => {
                  sessionStorage.removeItem('chunk_failed_reload');
                  window.location.reload();
                }} 
                className="mt-6 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors shadow-sm"
              >
                Reload Page
              </button>
              
              {/* Dev Only Details */}
              {import.meta.env?.MODE !== 'production' && (
                <div className="mt-6 text-left p-4 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-x-auto text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                  <p className="font-bold whitespace-pre-wrap break-all">{this.state.error?.message}</p>
                </div>
              )}
           </div>
        </div>
      );
    }
    return this.props.children; 
  }
}
