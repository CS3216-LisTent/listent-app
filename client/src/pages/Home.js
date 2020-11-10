import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";
import Posts from "../components/Posts";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { setHomeTabIndex } from "../actions/home-tab-actions";
import { setPostIndex, setPosts } from "../actions/audio-actions";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  tabs: {
    position: "fixed",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    zIndex: theme.zIndex.appBar,
  },
  swipeContainer: {
    height: "100%",
    "& > div": {
      height: "100%",
    },
  },
  emptyContainer: {
    paddingTop: theme.spacing(7),
  },
}));

export default function HomeWrapper() {
  return (
    <ErrorBoundary fallback={<Redirect to="/" />}>
      <SuspenseLoading>
        <Home />
      </SuspenseLoading>
    </ErrorBoundary>
  );
}

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const tabIndex = useSelector((state) => state.homeTab.index);
  const classes = useStyles();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

  const apiPath = !user
    ? `/api/v1/posts/discover/all?`
    : tabIndex === 0
    ? `/api/v1/posts/feed?`
    : `/api/v1/posts/discover?`;

  const handleChange = (_, newValue) => {
    dispatch(setHomeTabIndex(newValue));
    // Reset position after change section
    dispatch(setPostIndex(0));
    dispatch(setPosts(false));
  };

  return (
    <div className={classes.root}>
      {user && (
        <Tabs
          onChange={handleChange}
          className={classes.tabs}
          value={tabIndex}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Feed" />
          <Tab label="Discover" />
        </Tabs>
      )}
      <Posts apiPath={apiPath} />
    </div>
  );
}
