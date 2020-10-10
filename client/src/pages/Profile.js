import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import useSwr from "swr";
import { useSWRInfinite } from "swr";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Custom components
import Can from "../components/Can";
import ErrorBoundary from "../components/ErrorBoundary";
import GreenButton from "../components/GreenButton";
import InfiniteScroll from "../components/InfiniteScroll";
import PostCard from "../components/PostCard";
import RedButton from "../components/RedButton";
import SingleLineContainer from "../components/SingleLineContainer";
import SuspenseLoading from "../components/SuspenseLoading";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";
import { logoutUser } from "../actions/auth-actions";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(8),
  },
  avatar: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  flexItemCenter: {
    margin: "0 auto",
  },
  center: {
    textAlign: "center",
  },
  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  postsContainer: {
    marginTop: theme.spacing(1),
  },
}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { username } = useParams();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(2));
  }, [dispatch]);

  return (
    <Container className={classes.root}>
      <ErrorBoundary fallback={<Redirect to="/" />}>
        <SuspenseLoading>
          <UserProfile username={username} />
        </SuspenseLoading>
      </ErrorBoundary>
    </Container>
  );
}

function UserProfile({ username }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, mutate } = useSwr(`/api/v1/users/${username}`);

  const user = useSelector((state) => state.user);
  const { data: followingData, mutate: mutateFollowing } = useSwr(
    user ? `/api/v1/users/${username}/is-following` : null
  );
  const isFollowing = followingData && followingData.data;

  const [isLoading, setIsLoading] = useState(false);

  const {
    number_of_followers,
    number_of_following,
    number_of_posts,
    description,
    profile_picture,
  } = data.data;

  const follow = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/v1/users/${username}/follow`);
      mutate();
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
      mutate();
      mutateFollowing();
    } catch {
      dispatch(openSnackbar("An error occurred. Please try again.", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    dispatch(logoutUser());
  };

  return (
    <Grid container spacing={1}>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={12}>
          <Avatar
            className={clsx(classes.flexItemCenter, classes.avatar)}
            src={profile_picture}
          />
        </Grid>
        <SingleLineContainer
          component={Grid}
          item
          xs={12}
          className={classes.center}
        >
          <Typography variant="body1">{`@${username}`}</Typography>
        </SingleLineContainer>
        <Grid container item xs={12} className={classes.center}>
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <Typography className={classes.bold} variant="body1">
                {number_of_following}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                Following
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid item xs={12}>
              <Typography className={classes.bold} variant="body1">
                {number_of_followers}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                Followers
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid item xs={12}>
              <Typography className={classes.bold} variant="body1">
                {number_of_posts}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                Posts
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.center}>
          <Typography variant="caption" color="textSecondary">
            For business inquiries email to: management@radityadika.com
            www.radityadika.com
          </Typography>
        </Grid>
        <Can
          data={{ username: user && user.username, profile: username }}
          perform="user:view_follow_button"
          yes={() => (
            <Grid item xs={12}>
              <Can
                data={{ canFollow: !isFollowing }}
                perform="user:follow"
                yes={() => (
                  <GreenButton onClick={follow} fullWidth disabled={isLoading}>
                    {isLoading ? <CircularProgress /> : "Follow"}
                  </GreenButton>
                )}
                no={() => (
                  <RedButton onClick={unfollow} fullWidth disabled={isLoading}>
                    {isLoading ? <CircularProgress /> : "Unfollow"}
                  </RedButton>
                )}
              />
            </Grid>
          )}
        />
        <Can
          data={{ username: user && user.username, owner: username }}
          perform="user:update"
          yes={() => (
            <>
              <Grid item xs={12}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={null}
                  fullWidth
                  disabled={isLoading}
                  color="primary"
                  variant="contained"
                >
                  Edit Profile
                </Button>
              </Grid>
              <Grid item xs={12}>
                <RedButton
                  onClick={logout}
                  fullWidth
                  disabled={isLoading}
                  startIcon={isLoading ? undefined : <ExitToAppIcon />}
                >
                  {isLoading ? <CircularProgress /> : "Logout"}
                </RedButton>
              </Grid>
            </>
          )}
        />
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        className={classes.postsContainer}
      >
        <InfiniteScroll apiPath={`/api/v1/users/${username}/posts`}>
          {(data) => {
            console.log(data);
            return <p>Test</p>;
          }}
        </InfiniteScroll>
        <Grid item xs={6} sm={4}>
          <PostCard />
        </Grid>
        <Grid item xs={6} sm={4}>
          <PostCard />
        </Grid>
        <Grid item xs={6} sm={4}>
          <PostCard />
        </Grid>
        <Grid item xs={6} sm={4}>
          <PostCard />
        </Grid>
        <Grid item xs={6} sm={4}>
          <PostCard />
        </Grid>
      </Grid>
    </Grid>
  );
}
