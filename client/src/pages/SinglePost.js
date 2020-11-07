import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, Redirect } from "react-router-dom";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";

// Pages
import Post from "../components/Post";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

export default function SinglePost() {
  const classes = useStyles();
  const { id } = useParams();

  return (
    <div className={classes.root}>
      <ErrorBoundary fallback={<Redirect to="/" />}>
        <Post isSinglePost postId={id} hideNext hidePrevious />
      </ErrorBoundary>
    </div>
  );
}
