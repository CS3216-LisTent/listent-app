import { SET_REDIRECT_AFTER_AUTH } from "../actions/types";

const initialState = false;

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REDIRECT_AFTER_AUTH:
      return action.payload;
    default:
      return state;
  }
}
