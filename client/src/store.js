import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers";
import history from "./utils/history";

const initialState = {
  bottomNavigation: { index: 0 },
  homeTab: { index: 1 },
  snackbar: { isOpen: false, message: "", type: "success" },
  user: false,
  redirect: false,
  alert: {
    isOpen: false,
    title: "",
    description: "",
    rightText: null,
    rightCallback: null,
    leftText: null,
    leftCallback: null,
  },
  search: {
    searchTerm: "",
    searchTab: 1,
  },
  seed: 0,
  back: () => {
    history.goBack();
  },
  audio: {
    posts: false,
    index: 0,
    audioRef: undefined,
    swipeRef: undefined,
    src: undefined,
    apiPath: undefined,
    isEmpty: false,
  },
  notifications: {
    hasNew: false,
    notifications: false,
  },
};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
