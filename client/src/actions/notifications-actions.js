import { UPDATE_NOTIFICATIONS } from "./types";

export const updateNotifications= (notifications) => (dispatch) => {
  const lastChecked = localStorage.getItem("lastChecked");
  localStorage.setItem("lastChecked", new Date().toString());

  if (!lastChecked) {
    dispatch({
      type: UPDATE_NOTIFICATIONS,
      payload: {
        hasNew: true,
        notifications: notifications,
      },
    });
  }

  const isNewestSeen =
    new Date(lastChecked) >= new Date(notifications[0].timestamp + "Z");
  if (!isNewestSeen && notifications.length === 0) {
    dispatch({
      type: UPDATE_NOTIFICATIONS,
      payload: {
        hasNew: true,
        notifications: notifications,
      },
    });
  }
};
