import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Custom components
import AudioDetails from "./AudioDetails";
import AudioPlayer from "./AudioPlayer";
import Comments from "./Comments";
import SingleLineContainer from "./SingleLineContainer";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(7),
    backgroundImage: (props) =>
      `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.imageUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    height: "100%",
    backgroundSize: "cover",
  },
  center: {
    textAlign: "center",
  },
  container: {
    height: "100%",
  },
  gridContainer: {
    height: "100%",
  },
  commentsContainer: {
    overflowY: "scroll",
    paddingTop: theme.spacing(1),
  },
  collapse: {
    animationName: "$collapse",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  expand: {
    animationName: "$expand",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  "@keyframes collapse": {
    "100%": {
      flexBasis: "15%",
    },
  },
  "@keyframes expand": {
    "0%": {
      flexBasis: "15%",
    },
    "100%": {
      flexBasis: "100%",
    },
  },
}));

export default function Post(props) {
  const [isCommentScrolled, setIsCommentScrolled] = useState(null);
  const classes = useStyles({ ...props, isCommentScrolled });

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Grid
          container
          direction="column"
          wrap="nowrap"
          className={classes.gridContainer}
        >
          <Grid
            item
            xs={12}
            container
            direction="column"
            wrap="nowrap"
            className={clsx(
              isCommentScrolled && classes.collapse,
              isCommentScrolled === false && classes.expand
            )}
          >
            <Grid
              item
              xs={12}
              className={clsx(
                isCommentScrolled && classes.collapse,
                isCommentScrolled === false && classes.expand
              )}
            >
              <SingleLineContainer
                className={classes.center}
                component={Typography}
                variant="h5"
              >
                Coffin Dance
              </SingleLineContainer>
            </Grid>
            <Grid item xs={12}>
              <AudioDetails isMinimized={isCommentScrolled} />
              <AudioPlayer src={`${process.env.PUBLIC_URL}/coffin.mp3`} />
            </Grid>
          </Grid>
          <Grid
            onScroll={(e) => {
              if (e.target.scrollTop === 0) {
                setIsCommentScrolled(false);
              } else {
                setIsCommentScrolled(true);
              }
            }}
            item
            xs={12}
            className={classes.commentsContainer}
          >
            <Comments />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
