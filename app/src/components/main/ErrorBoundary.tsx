import { Component, ErrorInfo } from "react";
import Notification from "../common/Notification";
import { NotificationType } from "../../types/common/Notification";
import { ErrorBoundaryProps, ErrorBoundaryState } from "../../types/main/ErrorBoundary";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Notification
          type={NotificationType.ERROR}
          message={this.state.error.message}
          onClose={this.handleClose}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
