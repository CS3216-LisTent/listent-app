import { UPDATE_NOTIFICATIONS } from "./types";

export const updateNotifications = (notifications) => {
  const lastChecked = localStorage.getItem("lastChecked");
  localStorage.setItem("lastChecked", new Date().toString());

  if (!notifications) {
    // Set all notifications as read
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
    new Date(lastChecked) >= new Date(notifications[0].timestamp + "Z");
  if (!isNewestSeen && notifications.length === 0) {
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
