import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import DetectLinks from "./DetectLinks";
import FollowButton from "./FollowButton";
import SingleLineContainer from "./SingleLineContainer";

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
