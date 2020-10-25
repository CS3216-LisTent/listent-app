import React, { Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

// Custom components
import ErrorBoundary from "./ErrorBoundary";
import InfiniteScroll from "./InfiniteScroll";
import UserListItem from "./UserListItem";

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    padding: theme.spacing(1, 0),
    textAlign: "center",
  },
  progress: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

export default function UsersList({ apiPath, pageSize }) {
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
          pageSize={pageSize}
          component={List}
          apiPath={apiPath}
          noEntriesText={
            <Typography variant="caption">No results found</Typography>
          }
        >
          {(data) => {
            return data.map((page) =>
              page.map((result, i) => {
                return <UserListItem key={i} user={result} />;
              })
            );
          }}
        </InfiniteScroll>
      </Suspense>
    </ErrorBoundary>
  );
}
