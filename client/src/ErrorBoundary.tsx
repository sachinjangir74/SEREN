import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children?: ReactNode }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('Caught error:', error, errorInfo); }
  render() { 
    if (this.state.hasError) return (
      <div style={{padding:'20px',color:'red',position:'fixed',top:0,left:0,zIndex:9999,background:'white'}}>
        <h1>Error:</h1>
        <pre>{this.state.error?.message}</pre>
        <pre>{this.state.error?.stack}</pre>
      </div>
    ); 
    return this.props.children; 
  }
}
