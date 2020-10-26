import history from "../utils/history";
import { SET_BACK_ACTION } from "../actions/types";

const initialState = () => {
  history.goBack();
};

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BACK_ACTION:
      return action.payload || initialState;
    default:
      return state;
  }
}
