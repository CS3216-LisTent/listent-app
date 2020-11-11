import { UPDATE_NOTIFICATIONS } from "./types";

export const updateNotifications = (notifications) => {
  const lastChecked = localStorage.getItem("lastChecked");

  if (!notifications) {
    // Set all notifications as read
    localStorage.setItem("lastChecked", new Date().toString());
    return {
      type: UPDATE_NOTIFICATIONS,
      payload: {
        hasNew: false,
      },
    };
  }

  if (!lastChecked) {
    return {
      type: UPDATE_NOTIFICATIONS,
      payload: {
        hasNew: true,
        notifications: notifications,
      },
    };
  }

  const isNewestSeen =
    notifications.length !== 0 &&
    new Date(lastChecked) >= new Date(notifications[0].timestamp + "Z");

  if (!isNewestSeen && notifications.length !== 0) {
    return {
      type: UPDATE_NOTIFICATIONS,
      payload: {
        hasNew: true,
        notifications: notifications,
      },
    };
  }

  return {
    type: UPDATE_NOTIFICATIONS,
    payload: {
      hasNew: false,
      notifications: notifications,
    },
  };
};
