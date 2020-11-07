import {
  SET_POSTS,
  SET_POST_INDEX,
  SET_AUDIO_REF,
  SET_SWIPE_REF,
  SET_AUDIO_SRC,
} from "../actions/types";

const initialState = {
  posts: [],
  index: 0,
  audioRef: undefined,
  swipeRef: undefined,
  src: undefined,
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
    case SET_AUDIO_SRC:
      return { ...state, src: action.payload };
    default:
      return state;
  }
}
