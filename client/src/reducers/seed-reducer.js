import { SET_SEED } from "../actions/types";

const initialState = 0;

export default function seedReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEED:
      return action.payload;
    default:
      return state;
  }
}
