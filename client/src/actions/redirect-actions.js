import { SET_REDIRECT_AFTER_AUTH } from "./types";

export const setRedirectAfterAuth = (path) => {
  return { type: SET_REDIRECT_AFTER_AUTH, payload: path };
};
