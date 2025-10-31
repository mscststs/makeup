import React from "react";

// ErrorBoundary to catch render-time errors in the lazy-loaded component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // you could log to an external service here
    if (this.props.onError) this.props.onError(error, info);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
