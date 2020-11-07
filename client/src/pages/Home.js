import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Container from "@material-ui/core/Container";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";
import Instructions from "../components/Instructions";
import Posts from "../components/Posts";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import useInfinite from "../utils/use-infinite";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { setHomeTabIndex } from "../actions/home-tab-actions";

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

  const seed = useSelector((state) => state.seed);
  const { data, size, setSize, isEmpty } = useInfinite(
    !user
      ? `/api/v1/posts/discover/all?seed=${seed}&`
      : tabIndex === 0
      ? `/api/v1/posts/feed?`
      : `/api/v1/posts/discover?seed=${seed}&`,
    3
  );

  return <Posts apiPath={`/api/v1/posts/discover/all?seed=${seed}&`} />;
}
