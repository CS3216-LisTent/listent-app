import {
  SET_SEARCHED_TAGS,
  SET_SEARCHED_USERS,
  SET_SEARCH_TAB,
  SET_SEARCH_TERM,
} from "./types";

export const setSearchTerm = (term) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_TERM,
    payload: term,
  });
};

export const setSearchedTags = (tags) => (dispatch) => {
  dispatch({
    type: SET_SEARCHED_TAGS,
    payload: tags,
  });
};

export const setSearchedUsers = (users) => (dispatch) => {
  dispatch({
    type: SET_SEARCHED_USERS,
    payload: users,
  });
};

export const setSearchTab = (tabIndex) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_TAB,
    payload: tabIndex,
  });
};
