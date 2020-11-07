import { SET_POSTS, SET_POST_INDEX } from "./types";

export const setPosts = (posts) => {
  return {
    type: SET_POSTS,
    payload: posts,
  };
};

export const incPostIndex = () => (dispatch, state) => {
  dispatch({
    type: SET_POST_INDEX,
    payload:
      state.audio.posts.length - 1 > state.audio.index
        ? state.audio.index + 1
        : state.audio.posts.length - 1,
  });
};

export const decPostIndex = () => (dispatch, state) => {
  dispatch({
    type: SET_POST_INDEX,
    payload: state.audio.index > 0 ? state.audio.index - 1 : 0,
  });
};

export const setPostIndex = (index) => {
  return {
    type: SET_POST_INDEX,
    payload: index,
  };
};
