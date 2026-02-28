import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-red-900">
          <h1 className="text-2xl font-bold mb-4">Algo deu errado</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-auto">
            <h2 className="font-semibold text-red-600 mb-2">Erro:</h2>
            <pre className="bg-red-100 p-2 rounded text-sm mb-4 whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
            <h2 className="font-semibold text-red-600 mb-2">Stack Trace:</h2>
            <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
