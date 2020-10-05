import { combineReducers } from "redux";

import homeTabReducer from "./home-tab-reducer";
import bottomNavigationReducer from "./bottom-navigation-reducer";
import authReducer from "./auth-reducer";

export default combineReducers({
  homeTab: homeTabReducer,
  bottomNavigation: bottomNavigationReducer,
  user: authReducer,
});
