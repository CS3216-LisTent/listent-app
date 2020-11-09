import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import isEmpty from "validator/lib/isEmpty";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Prompt, Link } from "react-router-dom";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

// Icons
import DeleteIcon from "@material-ui/icons/Delete";

// Custom components
import AudioRecorder from "../components/AudioRecorder";
import Can from "../components/Can";
import GreenButton from "../components/GreenButton";

// Custom components
import StandAloneAudioPlayer from "../components/StandAloneAudioPlayer";
import LoadingBackdrop from "../components/LoadingBackdrop";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { openSnackbar } from "../actions/snackbar-actions";
import { openAlert } from "../actions/alert-actions";

// Utils
import { newPostErrors } from "../utils/validators";

const notifications = [
  {
    message: "yjpan47 liked your post Chipmunk noise",
    post_id: "857b6c88c81844248ea099eceb7ae523",
    timestamp: "2020-11-09T13:05:02.406458",
    username: "yjpan47",
  },
  {
    message:
      'yjpan47 commented on your post Chipmunk noise: "This sound is good! Haha"',
    post_id: "857b6c88c81844248ea099eceb7ae523",
    timestamp: "2020-11-09T13:06:10.018733",
    username: "yjpan47",
  },
  {
    message: "nelson followed you!",
    timestamp: "2020-11-09T13:29:29.426885",
  },
  {
    message: "nelson followed you!",
    timestamp: "2020-11-09T13:30:49.457675",
  },
  {
    message: "yjpan47 followed you!",
    timestamp: "2020-11-09T13:31:23.679896",
  },
  {
    message: "nelsontkyi followed you!",
    timestamp: "2020-11-09T16:57:01.501810",
  },
  {
    message: "nelsontkyi liked your post A new post!! test notif",
    post_ref: "c1714698bf90414ba023f920b4cce484",
    timestamp: "2020-11-09T16:57:11.484179",
    user_ref: "nelsontkyi",
  },
];

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
  }, [dispatch]);

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
  }

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5">Notifications</Typography>
      <List className={classes.root}>
        {notifications.map((notification, i) => {
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
