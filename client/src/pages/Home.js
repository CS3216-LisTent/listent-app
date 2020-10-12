import React, { useEffect, useRef, useState } from "react";
import useSwr from "swr";
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

const genPostIds = (data) =>
  data.reduce((acc, page) => [...acc, ...page.map((post) => post._id)], []);

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
  const { data: userInfo } = useSwr(
    user ? `/api/v1/users/${user.username}` : null
  );
  const hasFollowing =
    user && userInfo && userInfo.data && userInfo.data.number_of_following > 0;
  const tabIndex = useSelector((state) => state.homeTab.index);
  const classes = useStyles();
  const swipeRef = useRef(null);

  const { data, size, setSize, isEmpty } = useInfinite(
    !user
      ? `/api/v1/posts/discover/all`
      : tabIndex === 0
      ? `/api/v1/posts/feed/`
      : `/api/v1/posts/discover/`,
    3
  );
  let [postIds, setPostIds] = useState(genPostIds(data));

  useEffect(() => {
    setPostIds(genPostIds(data));
  }, [data]);

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
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setHomeTabIndex(user && hasFollowing ? 0 : 1));
  }, [dispatch, user, hasFollowing]);

  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if (firstLoad && data && data[0] && data[0][0]) {
      window.history.pushState({}, "", `/post/${data[0][0]._id}`);
      setFirstLoad(false);
    }
  }, [data, firstLoad]);

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
        <Container className={classes.emptyContainer}>
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
              window.history.pushState({}, "", `/post/${postIds[index]}`);
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
