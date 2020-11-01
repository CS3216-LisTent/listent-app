import React, { Suspense } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

// Material UI components
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "./ErrorBoundary";
import InfiniteScroll from "./InfiniteScroll";
import PostCard from "./PostCard";

// Redux
import { setSearchTerm } from "../actions/search-actions";

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
  center: {
    textAlign: "center",
  },
}));

export default function PostsList({
  apiPath,
  pageSize,
  noEntriesText,
  className,
  isShowSuggested,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      {isShowSuggested && (
        <div className={classes.center}>
          <Typography variant="h6">Popular hashtags</Typography>
        </div>
      )}
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
                page.map((item, i) => {
                  if (isShowSuggested) {
                    return (
                      <Grid key={i} item xs={6} sm={4}>
                        <PostCard
                          title={"#" + item.tag}
                          titleCenter
                          titleVariant="h5"
                          description=""
                          imageLink={item.image}
                          link={`/search/tags/${item.tag}`}
                          onClick={() => {
                            dispatch(setSearchTerm(item.tag));
                          }}
                        />
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid key={i} item xs={6} sm={4}>
                        <PostCard
                          title={item.title}
                          description={item.description}
                          imageLink={item.image_link}
                          link={`/post/${item._id}`}
                        />
                      </Grid>
                    );
                  }
                })
              );
            }}
          </InfiniteScroll>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
