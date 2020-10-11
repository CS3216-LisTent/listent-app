import React, { useEffect, useRef, useState, createRef } from "react";
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
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { setHomeTabIndex } from "../actions/home-tab-actions";

const PAGE_SIZE = 3;

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
  const { data: userInfo } = useSwr(
    user ? `/api/v1/users/${user.username}` : null
  );
  const hasFollowing =
    user && userInfo && userInfo.data && userInfo.data.number_of_following > 0;
  const tabIndex = useSelector((state) => state.homeTab.index);
  const classes = useStyles();
  const swipeRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [skip, setSkip] = useState(0);
  const { data } = useSwr(
    `/api/v1/posts/discover/all?skip=${skip}&limit=${PAGE_SIZE}`
  );
  const postsData = data.data;
  let audioRefs = Array.from({ length: PAGE_SIZE }, () => createRef());
  let [postIds, setPostIds] = useState(postsData.map((post) => post._id));

  useEffect(() => {
    setPostIds(postsData.map((post) => post._id));
  }, [postsData]);

  const posts = postsData.map((post, i) => {
    return (
      <div style={{ height: "100%" }} key={i}>
        <ErrorBoundary fallback={<Redirect to="/" />}>
          <SuspenseLoading>
            <Post
              audioRef={audioRefs[i]}
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
  });

  useEffect(() => {
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setHomeTabIndex(user && hasFollowing ? 0 : 1));
  }, [dispatch, user, hasFollowing]);

  useEffect(() => {
    if (firstLoad && data && data[0]) {
      window.history.pushState({}, "", `/post/${data[0]._id}`);
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
      {data.length === 0 ? (
        <Container className={classes.emptyContainer}>
          <Typography variant="h5">
            It seems a little lonely here... Start following other accounts now!
          </Typography>
        </Container>
      ) : (
        <ReactSwipe
          swipeOptions={{
            startSlide: swipeIndex,
            continuous: false,
            callback: (index) => {
              // if (index - 1 >= 0) {
              //   audioRefs[index - 1].current.pause();
              // }
              // if (index + 1 < postsData.length) {
              //   audioRefs[index + 1].current.pause();
              // }
              if (index + 1 === PAGE_SIZE) {
                // Last index of window
                setSkip(skip + 1);
                setSwipeIndex(1);
              }
              // audioRefs[index].current.play();
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
