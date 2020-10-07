import React from "react";
import { Redirect } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.state.error.message.includes("status code 404")) {
      return <Redirect to="/" />;
    } else {
      return this.props.fallback;
    }
  }
}
