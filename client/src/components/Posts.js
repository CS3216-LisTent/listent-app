import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import Instructions from "../components/Instructions";
import LoadingCenter from "../components/LoadingCenter";
import SuspenseLoading from "../components/SuspenseLoading";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import {
  setPostIndex,
  setSwipeRef,
  setApiPath,
} from "../actions/audio-actions";

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

export default function PostsWrapper({ apiPath }) {
  return (
    <ErrorBoundary fallback={<Redirect to="/" />}>
      <SuspenseLoading>
        <Posts apiPath={apiPath} />
      </SuspenseLoading>
    </ErrorBoundary>
  );
}

function Posts({ apiPath }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { posts, index, isEmpty } = useSelector((state) => state.audio);

  useEffect(() => {
    dispatch(setApiPath(apiPath));
  }, [apiPath, dispatch]);

  const swipeRef = useRef(null);

  useEffect(() => {
    dispatch(setSwipeRef(swipeRef));
  }, [dispatch]);

  const [runInstructions, setRunInstructions] = useState(false);

  return (
    <div className={classes.root}>
      {posts && <Instructions run={runInstructions} />}
      {isEmpty && posts ? (
        <Container maxWidth="sm" className={classes.emptyContainer}>
          <Typography variant="h5">
            It seems a little lonely here... Start following other accounts now!
          </Typography>
        </Container>
      ) : !posts ? (
        <LoadingCenter />
      ) : (
        <ReactSwipe
          swipeOptions={{
            startSlide: index,
            continuous: false,
            callback: (index) => {
              dispatch(setPostIndex(index));
            },
          }}
          ref={swipeRef}
          className={classes.swipeContainer}
        >
          {posts.map((post, i) => (
            <div style={{ height: "100%" }} key={i}>
              <SuspenseLoading>
                <Post
                  postId={post._id}
                  index={i}
                  setRunInstructions={setRunInstructions}
                />
              </SuspenseLoading>
            </div>
          ))}
        </ReactSwipe>
      )}
    </div>
  );
}
