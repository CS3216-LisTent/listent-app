import React, { useState } from "react";
import axios from "axios";
import useSwr from "swr";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import Can from "./Can";
import DetectLinks from "./DetectLinks";
import GreenButton from "./GreenButton";
import RedButton from "./RedButton";
import SingleLineContainer from "./SingleLineContainer";

// Redux
import { openSnackbar } from "../actions/snackbar-actions";

const useStyles = makeStyles((theme) => ({
  plainLink: {
    color: theme.palette.common.white,
    textDecoration: "none",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function AudioDetails({
  isMinimized,
  username,
  profilePicture,
  description,
}) {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const { data: followingData, mutate: mutateFollowing } = useSwr(
    user ? `/api/v1/users/${username}/is-following` : null
  );
  const isFollowing = followingData && followingData.data;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const follow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/v1/users/${username}/follow`);
      mutateFollowing();
    } catch {
      dispatch(openSnackbar("An error occurred. Please try again.", "error"));
    } finally {
      setIsLoading(false);
    }
  };
  const unfollow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/v1/users/${username}/unfollow`);
      mutateFollowing();
    } catch {
      dispatch(openSnackbar("An error occurred. Please try again.", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container>
      <Grid container item xs={12} spacing={1} wrap="nowrap">
        <Grid item xs={2}>
          <Avatar alt={username} src={profilePicture} />
        </Grid>
        <Grid container item xs={10} alignItems="center">
          <SingleLineContainer component={Grid} item xs={9}>
            <Typography
              className={classes.plainLink}
              variant="caption"
              component={Link}
              to={`/${username}`}
            >
              {`@${username}`}
            </Typography>
          </SingleLineContainer>
          <Can
            data={{ username: user && user.username, profile: username }}
            perform="user:view_follow_button"
            yes={() => (
              <Grid item xs={3}>
                <Can
                  data={{ canFollow: !isFollowing }}
                  perform="user:follow"
                  yes={() => (
                    <GreenButton
                      size="small"
                      onClick={follow}
                      disabled={isLoading}
                    >
                      Follow
                    </GreenButton>
                  )}
                  no={() => (
                    <RedButton
                      size="small"
                      onClick={unfollow}
                      disabled={isLoading}
                    >
                      Unfollow
                    </RedButton>
                  )}
                />
              </Grid>
            )}
          />
          {/* placeholder <Grid item xs={12}>
            <Typography variant="caption">2h ago</Typography>
          </Grid> */}
        </Grid>
      </Grid>
      <Collapse in={!isMinimized} timeout={1000} component={Grid} item xs={12}>
        <Typography variant="caption">
          <DetectLinks>{description}</DetectLinks>
        </Typography>
      </Collapse>
    </Grid>
  );
}
