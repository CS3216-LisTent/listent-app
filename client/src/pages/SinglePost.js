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
  const audioRef = useRef(null);

  return (
    <div className={classes.root}>
      <ErrorBoundary fallback={<Redirect to="/" />}>
        <SuspenseLoading>
          <Post audioRef={audioRef} postId={id} hideNext hidePrevious />
        </SuspenseLoading>
      </ErrorBoundary>
    </div>
  );
}
