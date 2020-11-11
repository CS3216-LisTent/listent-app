import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Material UI components
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { updateNotifications } from "../actions/notifications-actions";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(6),
  },
  inline: {
    display: "inline",
  },
  plainLink: {
    color: theme.palette.common.white,
    textDecoration: "none",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function Notifications({ update }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    update();
    dispatch(setBottomNavigationIndex(3));

    // Set hasNew to false
    dispatch(updateNotifications(false));
  }, [dispatch, update]);

  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    // Set hasNew to false
    dispatch(updateNotifications(false));
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return (
      <Container className={classes.root} maxWidth="sm">
        <Typography gutterBottom variant="h5">
          Notifications
        </Typography>
        <Box textAlign="center">
          <Typography variant="caption">No notifications yet!</Typography>
        </Box>
      </Container>
    );
  } else if (!notifications) {
    return (
      <Container className={classes.root} maxWidth="sm">
        <Typography gutterBottom variant="h5">
          Notifications
        </Typography>
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5">Notifications</Typography>
      <List>
        {notifications.map((notification, i) => {
          const {
            post_ref,
            user_ref,
            message,
            post_pic,
            user_pic,
          } = notification;

          const linkToVisit = !post_ref
            ? `${process.env.PUBLIC_URL}/${user_ref}`
            : `${process.env.PUBLIC_URL}/post/${post_ref}`;
          return (
            <Link to={linkToVisit} className={classes.plainLink} key={i}>
              <ListItem button alignItems="center">
                <Link
                  className={classes.plainLink}
                  to={`${process.env.PUBLIC_URL}/${user_ref}`}
                >
                  <ListItemAvatar>
                    <Avatar src={user_pic} />
                  </ListItemAvatar>
                </Link>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        <Link
                          className={classes.plainLink}
                          to={`${process.env.PUBLIC_URL}/${user_ref}`}
                        >
                          <strong>{user_ref}</strong>
                        </Link>{" "}
                        {message}
                      </Typography>
                    </React.Fragment>
                  }
                />
                {post_pic && (
                  <ListItemAvatar>
                    <Avatar variant="square" src={post_pic} />
                  </ListItemAvatar>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </Link>
          );
        })}
      </List>
    </Container>
  );
}
