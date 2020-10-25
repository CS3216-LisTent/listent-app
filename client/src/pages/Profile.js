import React, { lazy, useEffect, useState } from "react";
import clsx from "clsx";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  useParams,
  Redirect,
  Switch,
  Route,
  useRouteMatch,
  Link,
} from "react-router-dom";

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
import DetectLinks from "../components/DetectLinks";
import EditProfile from "../components/EditProfile";
import ErrorBoundary from "../components/ErrorBoundary";
import FollowButton from "../components/FollowButton";
import PostsList from "../components/PostsList";
import RedButton from "../components/RedButton";
import SingleLineContainer from "../components/SingleLineContainer";
import SuspenseLoading from "../components/SuspenseLoading";

// Actions
import { logoutUser } from "../actions/auth-actions";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

// Pages
const Follow = lazy(() => import("./Follow"));

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
  linkText: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const { username } = useParams();
  let { path } = useRouteMatch();
  return (
    <ErrorBoundary fallback={<Redirect to="/" />}>
      <SuspenseLoading>
        <Switch>
          <Route path={`${path}/:type`}>
            <Follow />
          </Route>
          <Route exact path={path}>
            <Container maxWidth="sm" className={classes.root}>
              <UserProfile username={username} />
            </Container>
          </Route>
        </Switch>
      </SuspenseLoading>
    </ErrorBoundary>
  );
}

function UserProfile({ username }) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const { data, mutate } = useSwr(`/api/v1/users/${username}`);

  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user && user.username === username) {
      dispatch(setBottomNavigationIndex(3));
    }
  }, [dispatch, user, username]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    number_of_followers,
    number_of_following,
    number_of_posts,
    description,
    picture,
  } = data.data;

  const logout = () => {
    setIsLoading(true);
    dispatch(logoutUser());
  };

  let { url } = useRouteMatch();

  if (isEdit) {
    return (
      <EditProfile
        description={description}
        profilePicture={picture}
        endEdit={() => setIsEdit(false)}
        mutate={mutate}
      />
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={12}>
          <Avatar
            className={clsx(classes.flexItemCenter, classes.avatar)}
            src={picture}
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
        <Grid item xs={12} className={classes.center}>
          <Typography variant="body1" color="textPrimary">
            <DetectLinks>{description}</DetectLinks>
          </Typography>
        </Grid>
        <Grid container item xs={12} className={classes.center}>
          <Grid
            container
            item
            xs={4}
            className={classes.linkText}
            component={Link}
            to={`${url}/following`}
          >
            <Grid item xs={12}>
              <Typography className={classes.bold} variant="body1">
                {number_of_following}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textPrimary">
                Following
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.linkText}
            component={Link}
            to={`${url}/followers`}
          >
            <Grid item xs={12}>
              <Typography className={classes.bold} variant="body1">
                {number_of_followers}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="textPrimary">
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
              <Typography variant="caption" color="textPrimary">
                Posts
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FollowButton username={username} />
        </Grid>
        <Can
          data={{ username: user && user.username, owner: username }}
          perform="user:update"
          yes={() => (
            <>
              <Grid item xs={12}>
                <Button
                  startIcon={<EditIcon />}
                  fullWidth
                  disabled={isLoading}
                  color="primary"
                  variant="contained"
                  onClick={() => setIsEdit(true)}
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
      <PostsList
        apiPath={`/api/v1/users/${username}/posts?`}
        noEntriesText="There are no posts here yet"
      />
    </Grid>
  );
}
