import React, { useRef } from "react";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, Redirect } from "react-router-dom";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";

// Pages
import Post from "../components/Post";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

export default function SinglePostWrapper() {
  const classes = useStyles();
  const { id } = useParams();

  return (
    <div className={classes.root}>
      <ErrorBoundary fallback={<Redirect to="/" />}>
        <SuspenseLoading>
          <SinglePost id={id} />
        </SuspenseLoading>
      </ErrorBoundary>
    </div>
  );
}

function SinglePost({ id }) {
  const { data, mutate } = useSwr(`/api/v1/posts/${id}`);
  const audioRef = useRef(null);

  return (
    <Post
      audioRef={audioRef}
      post={data.data}
      hideNext
      hidePrevious
    />
  );
}
