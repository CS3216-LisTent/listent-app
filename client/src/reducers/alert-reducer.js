import { OPEN_ALERT, CLOSE_ALERT } from "../actions/types";

const initialState = {
  isOpen: false,
  title: "",
  description: "",
  rightText: null,
  rightCallback: null,
  leftText: null,
  leftCallback: null,
};

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ALERT:
      return {
        isOpen: true,
        ...action.payload,
      };
    case CLOSE_ALERT: {
      return { ...state, isOpen: false };
    }
    default:
      return state;
  }
}
