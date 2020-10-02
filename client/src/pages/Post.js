import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// Material UI components
import Container from "@material-ui/core/Container";

// Custom components
import AudioPlayer from "../components/AudioPlayer";
import Comments from "../components/Comments";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: (props) =>
      `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.imageUrl})`,
    height: "100vh",
    backgroundSize: "cover",
  },
  audioContainer: {
    height: "50vh",
    position: "relative",
  },
  audioPlayer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  commentsContainer: {
    height: "50vh",
    overflow: "scroll",
    padding: theme.spacing(1),
  },
  commentsContainerExpandAnimation: {
    animationName: "$expandComments",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  audioContainerCollapseAnimation: {
    animationName: "$collapseAudio",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  audioContainerRevertAnimation: {
    animationName: "$audioRevert",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  commentsContainerRevertAnimation: {
    animationName: "$commentsRevert",
    animationDuration: "1s",
    animationFillMode: "forwards",
  },
  "@keyframes expandComments": {
    "100%": {
      height: "70vh",
    },
  },
  "@keyframes collapseAudio": {
    "100%": {
      height: "30vh",
    },
  },
  "@keyframes audioRevert": {
    "0%": {
      height: "30vh",
    },
    "100%": {
      height: "50vh",
    },
  },
  "@keyframes commentsRevert": {
    "0%": {
      height: "70vh",
    },
    "100%": {
      height: "50vh",
    },
  },
}));

export default function Post(props) {
  const classes = useStyles(props);
  const [isCommentScrolled, setIsCommentScrolled] = useState(null);

  return (
    <div className={classes.root}>
      <Container>
        <div
          className={clsx(
            classes.audioContainer,
            isCommentScrolled && classes.audioContainerCollapseAnimation,
            isCommentScrolled === false && classes.audioContainerRevertAnimation
          )}
        >
          <AudioPlayer className={classes.audioPlayer} />
        </div>
        <div
          className={clsx(
            classes.commentsContainer,
            isCommentScrolled && classes.commentsContainerExpandAnimation,
            isCommentScrolled === false &&
              classes.commentsContainerRevertAnimation
          )}
          onScroll={(e) => {
            if (e.target.scrollTop === 0) {
              setIsCommentScrolled(false);
            } else {
              setIsCommentScrolled(true);
            }
          }}
        >
          <Comments />
        </div>
      </Container>
    </div>
  );
}
