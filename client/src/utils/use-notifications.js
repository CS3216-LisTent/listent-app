import useSwr from "swr";
import { useDispatch } from "react-redux";

import { updateNotifications } from "../actions/notifications-actions";

export default function useNotifications() {
  const dispatch = useDispatch();

  // Refresh every 30 seconds
  useSwr("/api/v1/users", {
    refreshInterval: 30000,
    refreshWhenHidden: true,
    suspense: false,
    onSuccess: (data) => {
      const { notifications } = data.data;
      dispatch(updateNotifications(notifications));
    },
  });
}
