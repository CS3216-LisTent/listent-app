import { SET_BOTTOM_NAVIGATION_INDEX } from "./types";

export const setBottomNavigationIndex = (index) => ({
  type: SET_BOTTOM_NAVIGATION_INDEX,
  payload: index,
});
