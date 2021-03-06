import React, { createElement } from "react";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import VisibilitySensor from "react-visibility-sensor";

// Utils
import useInfinite from "../utils/use-infinite";

const useStyles = makeStyles((theme) => ({
  bottomContainer: {
    textAlign: "center",
    width: "100%",
  },
  loading: {
    marginTop: theme.spacing(1),
  },
}));

export default function InfiniteScroll({
  component,
  apiPath,
  children,
  noEntriesText,
  className,
  pageSize,
  ...rest
}) {
  const classes = useStyles();
  const {
    data,
    size,
    setSize,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
  } = useInfinite(apiPath, pageSize);

  const requestNextPage = (isVisible) => {
    if (isVisible && !isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  };

  return createElement(
    component ? component : "div",
    {
      className: className,
      ...rest,
    },
    <>
      {children(data)}
      <VisibilitySensor
        onChange={(isVisible) => {
          requestNextPage(isVisible);
        }}
        delayedCall={true}
      >
        <div className={classes.bottomContainer}>
          {isLoadingMore && !isReachingEnd ? (
            <CircularProgress className={classes.loading} color="secondary" />
          ) : !isReachingEnd ? (
            <Button color="primary" onClick={() => requestNextPage(true)}>
              Load More
            </Button>
          ) : isEmpty && noEntriesText ? (
            noEntriesText
          ) : (
            isEmpty && <Typography variant="caption">No data found</Typography>
          )}
        </div>
      </VisibilitySensor>
    </>
  );
}
