import { combineReducers } from "redux";

import authReducer from "./auth-reducer";
import bottomNavigationReducer from "./bottom-navigation-reducer";
import homeTabReducer from "./home-tab-reducer";
import snackbarReducer from "./snackbar-reducer";

export default combineReducers({
  bottomNavigation: bottomNavigationReducer,
  homeTab: homeTabReducer,
  snackbar: snackbarReducer,
  user: authReducer,
});
