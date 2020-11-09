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
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import Avatar from "@material-ui/core/Avatar";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { updateNotifications } from "../actions/notifications-actions";

const useStyles = makeStyles((theme) => ({
  root: {
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

export default function Notifications() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(3));

    // Set hasNew to false
    dispatch(updateNotifications(false));
  }, [dispatch]);

  const { notifications } = useSelector((state) => state.notifications);

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

  // Placeholder: TDOD: remove reverse
  const reversed = [...notifications].reverse();

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5">Notifications</Typography>
      <List className={classes.root}>
        {reversed.map((notification, i) => {
          const { post_id, username } = notification;

          const linkToVisit = !post_id
            ? `${process.env.PUBLIC_URL}/${username}`
            : `${process.env.PUBLIC_URL}/post/${post_id}`;
          return (
            <Link to={linkToVisit} className={classes.plainLink} key={i}>
              <ListItem button alignItems="flex-start">
                {/* <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar> */}
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {notification.message}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </Link>
          );
        })}
      </List>
    </Container>
  );
}
