import { SET_BOTTOM_NAVIGATION_INDEX } from "../actions/types";

const initialState = { index: 0 };

export default function bottomNavigationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOTTOM_NAVIGATION_INDEX:
      return {
        index: action.payload,
      };
    default:
      return state;
  }
}
