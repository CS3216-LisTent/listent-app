import {
  SET_POSTS,
  SET_POST_INDEX,
  SET_AUDIO_REF,
  SET_SWIPE_REF,
  SET_AUDIO_SRC,
} from "./types";

export const setPosts = (posts) => {
  return {
    type: SET_POSTS,
    payload: posts,
  };
};

export const incPostIndex = () => (dispatch, getState) => {
  dispatch({
    type: SET_POST_INDEX,
    payload:
      getState().audio.posts.length - 1 > getState().audio.index
        ? getState().audio.index + 1
        : getState().audio.posts.length - 1,
  });
};

export const decPostIndex = () => (dispatch, getState) => {
  dispatch({
    type: SET_POST_INDEX,
    payload: getState().audio.index > 0 ? getState().audio.index - 1 : 0,
  });
};

export const setPostIndex = (index) => {
  return {
    type: SET_POST_INDEX,
    payload: index,
  };
};

export const setAudioRef = (ref) => {
  return {
    type: SET_AUDIO_REF,
    payload: ref,
  };
};

export const setSwipeRef = (ref) => {
  return {
    type: SET_SWIPE_REF,
    payload: ref,
  };
};

export const setAudioSrc = (src) => {
  return {
    type: SET_AUDIO_SRC,
    payload: src,
  };
};
