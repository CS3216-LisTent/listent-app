import { UPDATE_NOTIFICATIONS } from "../actions/types";

const initialState = {
  hasNew: false,
  notifications: [],
};

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATIONS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
