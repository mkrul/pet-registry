import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "../shared/types/main/ErrorBoundary";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          className="bg-red-100 border-red-400 text-red-700 border px-4 py-3 rounded relative mb-4 flex justify-between items-center"
          role="alert"
        >
          <span className="block sm:inline">{this.state.error.message}</span>
          <button onClick={this.handleClose} className="ml-4" aria-label="Close">
            <span aria-hidden="true" className="text-xl">
              ×
            </span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
