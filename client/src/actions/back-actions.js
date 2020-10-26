import { SET_BACK_ACTION } from "./types";

export const setBack = (callback) => {
  return {
    type: SET_BACK_ACTION,
    payload: callback,
  };
};
