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

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const tabIndex = useSelector((state) => state.homeTab.index);
  const classes = useStyles();

  const { data, size, setSize, isEmpty } = useInfinite(
    !user
      ? `/api/v1/posts/discover/all`
      : tabIndex === 0
      ? `/api/v1/posts/feed/`
      : `/api/v1/posts/discover/`,
    3
  );

  const swipeRef = useRef(null);
  const [startSlide, setStartSlide] = useState(0);
  const posts = data.reduce(
    (acc, page, i) => [
      ...acc,
      ...page.map((post, j) => {
        const index = 3 * i + j;
        return (
          <div style={{ height: "100%" }} key={index}>
            <ErrorBoundary fallback={<Redirect to="/" />}>
              <SuspenseLoading>
                <Post
                  autoplay={index !== 0}
                  autopause
                  postId={post._id}
                  next={() => {
                    swipeRef.current.next();
                  }}
                  previous={() => {
                    swipeRef.current.prev();
                  }}
                  startSlide={startSlide}
                  index={index}
                />
              </SuspenseLoading>
            </ErrorBoundary>
          </div>
        );
      }),
    ],
    []
  );

  useEffect(() => {
    // On change tab, set size to 1 page
    setSize(1);
    // Reset start index of slide
    setStartSlide(0);
  }, [tabIndex, setSize]);

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
      {isEmpty ? (
        <Container maxWidth="sm" className={classes.emptyContainer}>
          <Typography variant="h5">
            It seems a little lonely here... Start following other accounts now!
          </Typography>
        </Container>
      ) : (
        <ReactSwipe
          swipeOptions={{
            startSlide: startSlide,
            continuous: false,
            callback: (index) => {
              setStartSlide(index);
              if (index + 1 === posts.length) {
                // Load more if next is last
                setSize(size + 1);
              }
            },
          }}
          ref={swipeRef}
          className={classes.swipeContainer}
        >
          {posts}
        </ReactSwipe>
      )}
    </div>
  );
}
