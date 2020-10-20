import { OPEN_ALERT, CLOSE_ALERT } from "./types";

export const closeAlert = () => {
  return {
    type: CLOSE_ALERT,
  };
};

export const openAlert = (
  title,
  description,
  rightText,
  rightCallback,
  leftText,
  leftCallback
) => (dispatch) => {
  dispatch(closeAlert());

  dispatch({
    type: OPEN_ALERT,
    payload: {
      title: !title ? "" : title,
      description: !description ? "" : description,
      rightText: !rightText ? "OK" : rightText,
      rightCallback: !rightCallback
        ? () => dispatch(closeAlert())
        : () => {
            dispatch(closeAlert());
            rightCallback();
          },
      leftText,
      leftCallback: !leftCallback
        ? () => dispatch(closeAlert())
        : () => {
            dispatch(closeAlert());
            leftCallback();
          },
    },
  });
};
