import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { logoutUser } from "../actions/auth-actions";

class ErrorBoundary extends React.Component {
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
    } else if (
      this.state.error.message.includes("status code 401") ||
      this.state.error.message.includes("status code 403")
    ) {
      this.props.logoutUser();
    } else {
      return this.props.fallback;
    }
  }
}

export default connect(null, (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
}))(ErrorBoundary);
