import { combineReducers } from "redux";

import homeTabReducer from "./home-tab-reducer";

export default combineReducers({
  homeTab: homeTabReducer,
});
