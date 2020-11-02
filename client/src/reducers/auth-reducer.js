import { SET_USER, SET_FOLLOW } from "../actions/types";

const initialState = false;

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    case SET_FOLLOW:
      return state && { ...state, ...action.payload };
    default:
      return state;
  }
}
