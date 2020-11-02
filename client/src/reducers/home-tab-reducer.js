import { SET_HOME_TAB_INDEX } from "../actions/types";

const initialState = { index: 1 };

export default function homeTabReducer(state = initialState, action) {
  switch (action.type) {
    case SET_HOME_TAB_INDEX:
      return {
        index: action.payload,
      };
    default:
      return state;
  }
}
