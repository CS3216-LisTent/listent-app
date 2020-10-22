import {
  SET_SEARCH_TAB,
  SET_SEARCH_TERM,
} from "./types";

export const setSearchTerm = (term) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_TERM,
    payload: term,
  });
};

export const setSearchTab = (tabIndex) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_TAB,
    payload: tabIndex,
  });
};
