import { SET_POSTS, SET_POST_INDEX } from "../actions/types";

const initialState = { posts: [], index: 0 };

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POSTS:
      return { ...state, posts: action.payload };
    case SET_POST_INDEX:
      return { ...state, index: action.payload };
    default:
      return state;
  }
}
