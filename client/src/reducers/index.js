import { combineReducers } from "redux";

import authReducer from "./auth-reducer";
import bottomNavigationReducer from "./bottom-navigation-reducer";
import homeTabReducer from "./home-tab-reducer";
import snackbarReducer from "./snackbar-reducer";
import redirectReducer from "./redirect-reducer";
import alertReducer from "./alert-reducer";
import searchReducer from "./search-reducer";
import seedReducer from "./seed-reducer";
import backReducer from "./back-reducer";
import audioReducer from "./audio-reducer";
import notificationsReducer from "./notifications-reducer";

export default combineReducers({
  bottomNavigation: bottomNavigationReducer,
  homeTab: homeTabReducer,
  snackbar: snackbarReducer,
  user: authReducer,
  redirect: redirectReducer,
  alert: alertReducer,
  search: searchReducer,
  seed: seedReducer,
  back: backReducer,
  audio: audioReducer,
  notifications: notificationsReducer,
});
