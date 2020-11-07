import {
  SET_POSTS,
  SET_POST_INDEX,
  SET_AUDIO_REF,
  SET_SWIPE_REF,
} from "../actions/types";

const initialState = {
  posts: [],
  index: 0,
  audioRef: undefined,
  swipeRef: undefined,
};

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POSTS:
      return { ...state, posts: action.payload };
    case SET_POST_INDEX:
      return { ...state, index: action.payload };
    case SET_AUDIO_REF:
      return { ...state, audioRef: action.payload };
    case SET_SWIPE_REF:
      return { ...state, swipeRef: action.payload };
    default:
      return state;
  }
}
