import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";
import Instructions from "../components/Instructions";

// Other components
import ReactSwipe from "react-swipe";

// Pages
import Post from "../components/Post";

// Utils
import useInfinite from "../utils/use-infinite";
import { setPosts, setPostIndex } from "../actions/audio-actions";

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

const PAGE_SIZE = 3;

function Posts({ apiPath }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { posts, index } = useSelector((state) => state.audio);
  const { data, size, setSize, isEmpty } = useInfinite(apiPath, PAGE_SIZE);

  useEffect(() => {
    dispatch(setPosts(data.flat()));
  }, [data]);

  const swipeRef = useRef(null);

  const [runInstructions, setRunInstructions] = useState(false);

  return (
    <div className={classes.root}>
      {posts && <Instructions run={runInstructions} />}
      {isEmpty ? (
        <Container maxWidth="sm" className={classes.emptyContainer}>
          <Typography variant="h5">
            It seems a little lonely here... Start following other accounts now!
          </Typography>
        </Container>
      ) : (
        <ReactSwipe
          swipeOptions={{
            startSlide: index,
            continuous: false,
            callback: (index) => {
              dispatch(setPostIndex(index));
              if (index + 1 === posts.length) {
                // Load more if next is last
                setSize(size + 1);
              }
            },
          }}
          ref={swipeRef}
          className={classes.swipeContainer}
        >
          {posts.map((post, i) => (
            <div style={{ height: "100%" }} key={i}>
              <SuspenseLoading>
                <Post
                  autoplay={i !== 0}
                  autopause
                  postId={post._id}
                  next={() => {
                    swipeRef.current.next();
                  }}
                  previous={() => {
                    swipeRef.current.prev();
                  }}
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
