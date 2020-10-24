import React from "react";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core";
import { useParams } from "react-router-dom";

// Material UI components
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";

// Custom components
import ErrorBoundary from "../components/ErrorBoundary";
import SuspenseLoading from "../components/SuspenseLoading";
import UserListItem from "../components/UserListItem";

// Utils
import { capitalizeFirstLetter } from "../utils/general-utils";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
  },
  errorContainer: {
    padding: theme.spacing(1, 0),
    textAlign: "center",
  },
}));

export default function Follow() {
  const classes = useStyles();
  const { username, type: urlType } = useParams();
  const { data, mutate } = useSwr(`/api/v1/users/${username}`);
  const type = urlType === "following" ? "followings" : urlType;
  const follow = data.data[type];

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5">{capitalizeFirstLetter(urlType)}</Typography>
      {follow.length === 0 ? (
        <div className={classes.errorContainer}>
          <Typography variant="caption">{`No ${urlType} yet!`}</Typography>
        </div>
      ) : (
        <ErrorBoundary
          fallback={
            <div className={classes.errorContainer}>
              <Typography variant="caption">
                An error occurred. Please refresh and try again.
              </Typography>
            </div>
          }
        >
          <SuspenseLoading>
            <List>
              {follow
                .map((f) => ({ picture: f.picture, _id: f.username }))
                .map((user, i) => (
                  <UserListItem user={user} key={i} actionCallback={mutate} />
                ))}
            </List>
          </SuspenseLoading>
        </ErrorBoundary>
      )}
    </Container>
  );
}
