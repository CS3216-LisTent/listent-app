import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/set-auth-token";
import { SET_USER } from "./types";

export const setUser = (jwtString) => {
  if (!jwtString) {
    return {
      type: SET_USER,
      payload: {},
    };
  }

  setAuthToken(jwtString);
  const decoded = jwt_decode(jwtString);
  const username = decoded["sub"].split("|")[1];

  return {
    type: SET_USER,
    payload: { ...decoded, username },
  };
};

export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwt");
  sessionStorage.removeItem("jwt");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to empty object
  dispatch(setUser(false));
  window.location.href = "/login";
};
