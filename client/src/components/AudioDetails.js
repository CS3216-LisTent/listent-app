import React, { useState } from "react";
import axios from "axios";
import useSwr from "swr";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import Can from "./Can";
import DetectLinks from "./DetectLinks";
import FollowButton from "./FollowButton";
import GreenButton from "./GreenButton";
import RedButton from "./RedButton";
import SingleLineContainer from "./SingleLineContainer";

// Redux
import { openSnackbar } from "../actions/snackbar-actions";

const useStyles = makeStyles((theme) => ({
  plainLink: {
    color: theme.palette.common.white,
    textDecoration: "none",
    fontWeight: theme.typography.fontWeightMedium,
  },
  followContainer: {
    textAlign: "right",
  },
}));

export default function AudioDetails({
  isMinimized,
  username,
  profilePicture,
  description,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Grid container>
      <Grid container item xs={12} spacing={1} wrap="nowrap">
        <Grid item xs={2}>
          <Avatar alt={username} src={profilePicture} />
        </Grid>
        <Grid container item xs={10} alignItems="center">
          <SingleLineContainer component={Grid} item xs={8}>
            <Typography
              className={classes.plainLink}
              variant="caption"
              component={Link}
              to={`/${username}`}
            >
              {`@${username}`}
            </Typography>
          </SingleLineContainer>
          <Grid item xs={3} className={classes.followContainer}>
            <FollowButton size="small" username={username} />
          </Grid>
          {/* placeholder <Grid item xs={12}>
            <Typography variant="caption">2h ago</Typography>
          </Grid> */}
        </Grid>
      </Grid>
      <Collapse in={!isMinimized} timeout={1000} component={Grid} item xs={12}>
        <Typography variant="caption">
          <DetectLinks>{description}</DetectLinks>
        </Typography>
      </Collapse>
    </Grid>
  );
}
