import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from "../actions/types";

const initialState = { isOpen: false, message: "", type: "success" };

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        isOpen: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    case CLOSE_SNACKBAR: {
      return { isOpen: false, type: state.type };
    }
    default:
      return state;
  }
}
