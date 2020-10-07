import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { setRedirectAfterAuth } from "../actions/redirect-actions";

export default function PrivateRoute({ children, ...rest }) {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user);

  if (!isAuth) {
    dispatch(setRedirectAfterAuth(window.location.pathname));
  }

  return (
    <Route
      {...rest}
      render={() => (isAuth ? children : <Redirect to="/login" />)}
    />
  );
}
