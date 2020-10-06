import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from "./types";

export const closeSnackbar = () => {
  return {
    type: CLOSE_SNACKBAR,
  };
};

export const openSnackbar = (message, type) => (dispatch) => {
  dispatch(closeSnackbar());

  dispatch({
    type: OPEN_SNACKBAR,
    payload: { message, type },
  });
};
