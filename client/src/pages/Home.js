import React, { useEffect, useRef, useState, createRef } from "react";
import axios from "axios";
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

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (firstLoad) {
      axios
        .get(`/api/v1/posts/discover/all?skip=${0}&limit=${PAGE_SIZE}`)
        .then((res) => {
          const data = res.data.data;
          setPosts(
            data.map((post, i) => {
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
            })
          );
          // window.history.pushState({}, "", `/post/${data[0]._id}`);
          setFirstLoad(false);
        });
    }
  }, [firstLoad]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [firstUnloaded, setFirstUnloaded] = useState(3);
  let [audioRefs, setAudioRefs] = useState(
    Array.from({ length: PAGE_SIZE }, () => createRef())
  );

  const loadOneMore = () => {
    axios
      .get(`/api/v1/posts/discover/all?skip=${firstUnloaded}&limit=${1}`)
      .then((res) => {
        setFirstUnloaded(firstUnloaded + 1);
        const post = res.data.data[0];
        const newAudioRefs = [...audioRefs];
        newAudioRefs[0] = audioRefs[1];
        newAudioRefs[1] = audioRefs[2];
        newAudioRefs[2] = createRef();

        const newPosts = [...posts];
        newPosts[0] = posts[1];
        newPosts[1] = posts[2];
        newPosts[2] = (
          <ErrorBoundary fallback={<Redirect to="/" />}>
            <SuspenseLoading>
              <Post
                audioRef={audioRefs[2]}
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
        );

        setAudioRefs(newAudioRefs);
        setPosts(newPosts);
      });
  };

  useEffect(() => {
    dispatch(setBottomNavigationIndex(0));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setHomeTabIndex(user && hasFollowing ? 0 : 1));
  }, [dispatch, user, hasFollowing]);

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
      {posts.length === 0 ? (
        <Container className={classes.emptyContainer}>
          <Typography variant="h5">
            It seems a little lonely here... Start following other accounts now!
          </Typography>
        </Container>
      ) : (
        <ReactSwipe
          swipeOptions={{
            startSlide: 1,
            continuous: false,
            // callback: (index) => {
            //   if (index - 1 >= 0) {
            //     audioRefs[index - 1].current.pause();
            //   }
            //   if (index + 1 < PAGE_SIZE) {
            //     audioRefs[index + 1].current.pause();
            //   }
            //   if (index + 1 === PAGE_SIZE) {
            //     loadOneMore();
            //   }
            //   console.log(index);
            //   audioRefs[index].current.play();
            //   // window.history.pushState({}, "", `/post/${postIds[index]}`);
            // },
          }}
          ref={swipeRef}
          className={classes.swipeContainer}
        >
          {[<div>test</div>, null, null]}
        </ReactSwipe>
      )}
    </div>
  );
}
