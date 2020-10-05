import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

// Material UI components
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import PostCard from "../components/PostCard";
import SingleLineContainer from "../components/SingleLineContainer";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  avatar: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  flexItemCenter: {
    margin: "0 auto",
  },
  center: {
    textAlign: "center",
  },
  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(2));
  }, [dispatch]);

  return (
    <Container className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={12} style={{ height: 72, width: 72 }}>
            <Avatar
              className={clsx(classes.flexItemCenter, classes.avatar)}
              src={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`}
            />
          </Grid>
          <SingleLineContainer
            component={Grid}
            item
            xs={12}
            className={classes.center}
          >
            <Typography variant="body1">@therealradityaria</Typography>
          </SingleLineContainer>
          <Grid container item xs={12} className={classes.center}>
            <Grid container item xs={4}>
              <Grid item xs={12}>
                <Typography className={classes.bold} variant="body1">
                  369
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Following
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid item xs={12}>
                <Typography className={classes.bold} variant="body1">
                  369
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Followers
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid item xs={12}>
                <Typography className={classes.bold} variant="body1">
                  369
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Posts
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Typography variant="caption" color="textSecondary">
              For business inquiries email to: management@radityadika.com
              www.radityadika.com
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6} sm={4}>
            <PostCard />
          </Grid>
          <Grid item xs={6} sm={4}>
            <PostCard />
          </Grid>
          <Grid item xs={6} sm={4}>
            <PostCard />
          </Grid>
          <Grid item xs={6} sm={4}>
            <PostCard />
          </Grid>
          <Grid item xs={6} sm={4}>
            <PostCard />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}