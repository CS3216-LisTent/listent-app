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

  // Placeholder: TDOD: remove get last index
  const isNewestSeen =
    new Date(lastChecked) >=
    new Date(notifications[notifications.length - 1].timestamp + "Z");

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
