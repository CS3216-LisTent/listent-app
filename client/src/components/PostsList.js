import React, { Suspense } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";

// Material UI components
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "./ErrorBoundary";
import InfiniteScroll from "./InfiniteScroll";
import PostCard from "./PostCard";

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    padding: theme.spacing(1, 0),
    textAlign: "center",
  },
  postsContainer: {
    marginTop: theme.spacing(1),
  },
  progress: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

export default function PostsList({
  apiPath,
  pageSize,
  noEntriesText,
  className,
}) {
  const classes = useStyles();
  return (
    <ErrorBoundary
      fallback={
        <div className={classes.errorContainer}>
          <Typography variant="caption">
            An error occurred. Please refresh and try again.
          </Typography>
        </div>
      }
    >
      <Suspense fallback={<LinearProgress className={classes.progress} />}>
        <InfiniteScroll
          component={Grid}
          container
          item
          xs={12}
          spacing={1}
          className={clsx(classes.postsContainer, className)}
          apiPath={apiPath}
          pageSize={pageSize}
          noEntriesText={
            <Typography variant="caption">{noEntriesText}</Typography>
          }
        >
          {(data) => {
            return data.map((page) =>
              page.map((post, i) => {
                return (
                  <Grid key={i} item xs={6} sm={4}>
                    <PostCard
                      title={post.title}
                      description={post.description}
                      imageLink={post.image_link}
                      link={`/post/${post._id}`}
                    />
                  </Grid>
                );
              })
            );
          }}
        </InfiniteScroll>
      </Suspense>
    </ErrorBoundary>
  );
}
