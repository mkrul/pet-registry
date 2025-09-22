import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 ErrorBoundary: Error caught:", error, errorInfo);
    console.error("🚨 ErrorBoundary: Error stack:", error.stack);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
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
