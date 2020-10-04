import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// Material UI components
import Container from "@material-ui/core/Container";
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
  container: {
    height: "100%",
  },
  audioContainer: {
    position: "relative",
    height: "50%",
  },
  audioTitle: {
    textAlign: "center",
    paddingTop: theme.spacing(1),
  },
  audio: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  commentsContainer: {
    height: "50%",
    overflowY: "scroll",
    paddingTop: theme.spacing(1),
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
      height: `65%`,
    },
  },
  "@keyframes collapseAudio": {
    "100%": {
      height: `35%`,
    },
  },
  "@keyframes audioRevert": {
    "0%": {
      height: `35%`,
    },
    "100%": {
      height: `50%`,
    },
  },
  "@keyframes commentsRevert": {
    "0%": {
      height: `65%`,
    },
    "100%": {
      height: `50%`,
    },
  },
}));

export default function Post(props) {
  const [isCommentScrolled, setIsCommentScrolled] = useState(null);
  const classes = useStyles({ ...props, isCommentScrolled });

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <div
          className={clsx(
            classes.audioContainer,
            isCommentScrolled && classes.audioContainerCollapseAnimation,
            isCommentScrolled === false && classes.audioContainerRevertAnimation
          )}
        >
          <SingleLineContainer
            className={classes.audioTitle}
            component={Typography}
            variant="h5"
          >
            Audio TitleAudio TitleAudio TitleAudio TitleAudio TitleAudio
            TitleAudio TitleAudio TitleAudio TitleAudio TitleAudio TitleAudio
            Title
          </SingleLineContainer>
          <div className={classes.audio}>
            <AudioDetails isMinimized={isCommentScrolled} />
            <AudioPlayer src={`${process.env.PUBLIC_URL}/coffin.mp3`} />
          </div>
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
