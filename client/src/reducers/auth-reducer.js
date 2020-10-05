import { SET_USER } from "../actions/types";

const initialState = false;

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default:
      return state;
  }
}
