import React, { createElement } from "react";
import { useSWRInfinite } from "swr";
import axios from "axios";

// Material UI components
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import VisibilitySensor from "react-visibility-sensor";

const PAGE_SIZE = 6;

const useStyles = makeStyles({
  bottomContainer: {
    textAlign: "center",
    width: "100%",
  },
});

export default function InfiniteScroll({
  component,
  apiPath,
  children,
  noEntriesText,
  className,
  ...rest
}) {
  const classes = useStyles();
  const { data, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) {
        return null;
      }
      return `${apiPath}?skip=${pageIndex * PAGE_SIZE}&limit=${PAGE_SIZE}`;
    },
    (url) => axios.get(url).then((res) => res.data.data)
  );

  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined";
  const isEmpty = data[0].length === 0;
  const isReachingEnd = isEmpty || data[data.length - 1].length < PAGE_SIZE;

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
            <CircularProgress color="secondary" />
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
