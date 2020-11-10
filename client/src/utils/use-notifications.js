import useSwr from "swr";
import { useDispatch, useSelector } from "react-redux";

import { updateNotifications } from "../actions/notifications-actions";

export default function useNotifications() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Refresh every 30 seconds
  const { mutate } = useSwr(user && "/api/v1/users", {
    refreshInterval: 30000,
    refreshWhenHidden: true,
    suspense: false,
    onSuccess: (data) => {
      const { notifications } = data.data;
      dispatch(updateNotifications(notifications));
    },
  });

  return mutate;
}
