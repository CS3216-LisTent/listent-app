import { combineReducers } from "redux";

import homeTabReducer from "./home-tab-reducer";
import bottomNavigationReducer from "./bottom-navigation-reducer";

export default combineReducers({
  homeTab: homeTabReducer,
  bottomNavigation: bottomNavigationReducer,
});
