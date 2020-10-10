import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

// Icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";

// Custom components
import AudioDetails from "./AudioDetails";
import AudioPlayer from "./AudioPlayer";
import Comments from "./Comments";
import ShareDrawer from "./ShareDrawer";
import SingleLineContainer from "./SingleLineContainer";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(7),
    backgroundImage: ({ imageUrl }) =>
      `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    height: "100%",
    backgroundSize: "cover",
  },
  likeShareContainer: {
    position: "fixed",
    right: 0,
    top: "10%",
    display: "flex",
    flexDirection: "column",
  },
  likeButton: {
    display: "flex",
    flexDirection: "column",
  },
  center: {
    textAlign: "center",
  },
  container: {
    height: "100%",
    padding: theme.spacing(0, 3),
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

export default function Post({
  audioRef,
  post,
  next,
  previous,
  hideNext,
  hidePrevious,
  refresh,
  ...rest
}) {
  const [isCommentScrolled, setIsCommentScrolled] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const classes = useStyles({ imageUrl: post.image_link, isCommentScrolled });
  const commentsRef = useRef(null);

  const onCommentsScroll = () => {
    if (commentsRef.current && commentsRef.current.scrollTop === 0) {
      setIsCommentScrolled(false);
    } else {
      setIsCommentScrolled(true);
    }
  };
  console.log(post);

  return (
    <div className={classes.root}>
      <ShareDrawer isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
      <div className={classes.likeShareContainer}>
        <IconButton classes={{ label: classes.likeButton }}>
          <FavoriteBorderIcon />
          <Typography variant="caption">{post.likedBy.length}</Typography>
        </IconButton>
        <IconButton onClick={() => setIsShareOpen(true)}>
          <ShareIcon />
        </IconButton>
      </div>
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
                {post.title}
              </SingleLineContainer>
            </Grid>
            <Grid item xs={12} style={{ flexGrow: 0 }}>
              <AudioDetails
                username={post.username}
                profilePicture={post.profile_picture}
                description={post.description}
                isMinimized={isCommentScrolled}
              />
              <AudioPlayer
                audioRef={audioRef}
                next={next}
                previous={previous}
                hideNext={hideNext}
                hidePrevious={hidePrevious}
                src={post.audio_link}
              />
            </Grid>
          </Grid>
          <Grid
            ref={commentsRef}
            onWheel={onCommentsScroll}
            onTouchMove={onCommentsScroll}
            item
            xs={12}
            className={classes.commentsContainer}
          >
            <Comments
              postId={post._id}
              comments={post.comments}
              refresh={refresh}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
