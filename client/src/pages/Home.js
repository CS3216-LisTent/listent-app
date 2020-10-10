import React, { useEffect, useRef, createRef } from "react";
import useSwr from "swr";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import { setHomeTabIndex } from "../actions/home-tab-actions";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

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
  const tabIndex = useSelector((state) =>
    state.user ? state.homeTab.index : 1
  );
  const classes = useStyles();
  const swipeRef = useRef(null);

  const { data, mutate } = useSwr("/api/v1/posts/discover/all?skip=0&limit=5");
  const audioRefs = useRef(data.data.map(() => createRef()));

  const posts = data.data.map((post, i) => (
    <Post
      audioRef={audioRefs.current[i]}
      refresh={mutate}
      post={post}
      next={() => {
        swipeRef.current.next();
      }}
      previous={() => {
        swipeRef.current.prev();
      }}
    />
  ));

  useEffect(() => {
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

  const handleChange = (_, newValue) => {
    dispatch(setHomeTabIndex(newValue));
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
      <ReactSwipe
        swipeOptions={{
          continuous: false,
          callback: (index) => {
            if (index - 1 >= 0) {
              audioRefs.current[index - 1].current.pause();
            }
            if (index + 1 < data.data.length) {
              audioRefs.current[index + 1].current.pause();
            }
            audioRefs.current[index].current.play();
          },
        }}
        ref={swipeRef}
        className={classes.swipeContainer}
      >
        {posts.map((p, i) => (
          <div style={{ height: "100%" }} key={i}>
            {p}
          </div>
        ))}
      </ReactSwipe>
    </div>
  );
}
