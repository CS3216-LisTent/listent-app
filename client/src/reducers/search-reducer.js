import { SET_SEARCH_TAB, SET_SEARCH_TERM } from "../actions/types";

const initialState = {
  searchTerm: "",
  searchTab: 0,
};

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_TAB:
      return { ...state, searchTab: action.payload };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
}
