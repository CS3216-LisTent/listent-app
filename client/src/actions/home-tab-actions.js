import { SET_HOME_TAB_INDEX } from "./types";

export const setHomeTabIndex = (index) => ({
  type: SET_HOME_TAB_INDEX,
  payload: index,
});
