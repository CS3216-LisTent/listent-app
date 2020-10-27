import React, { useState } from "react";
import clsx from "clsx";
import axios from "axios";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

// Material UI components
import Grid from "@material-ui/core/Grid";

// Custom components
import Can from "../components/Can";
import GreenButton from "../components/GreenButton";
import RedButton from "../components/RedButton";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.7rem",
    },
  },
}));

export default function FollowButton({
  username,
  callback,
  mutateUser,
  ...rest
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { data: followingData, mutate: mutateFollowing } = useSwr(
    user ? `/api/v1/users/${username}/is-following` : null
  );
  const isFollowing = followingData && followingData.data;
  const [isLoading, setIsLoading] = useState(false);

  const follow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/v1/users/${username}/follow`);

      if (mutateUser) {
        mutateUser();
      }

      mutateFollowing();
    } catch {
      dispatch(openSnackbar("An error occurred. Please try again.", "error"));
    } finally {
      setIsLoading(false);
      if (callback) {
        callback();
      }
    }
  };

  const unfollow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/v1/users/${username}/unfollow`);

      if (mutateUser) {
        mutateUser();
      }

      mutateFollowing();
    } catch {
      dispatch(openSnackbar("An error occurred. Please try again.", "error"));
    } finally {
      setIsLoading(false);
      if (callback) {
        callback();
      }
    }
  };

  return (
    <Can
      data={{ username: user && user.username, profile: username }}
      perform="user:view_follow_button"
      yes={() => (
        <Grid item xs={12}>
          <Can
            data={{ canFollow: !isFollowing }}
            perform="user:follow"
            yes={() => (
              <GreenButton
                {...rest}
                className={clsx(rest.className, classes.button)}
                onClick={follow}
                fullWidth
                disabled={isLoading}
              >
                Follow
              </GreenButton>
            )}
            no={() => (
              <RedButton
                {...rest}
                className={clsx(rest.className, classes.button)}
                onClick={unfollow}
                fullWidth
                disabled={isLoading}
              >
                Unfollow
              </RedButton>
            )}
          />
        </Grid>
      )}
    />
  );
}
