import { UPDATE_NOTIFICATIONS } from "../actions/types";

const initialState = {
  hasNew: false,
  notifications: false,
};

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATIONS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
