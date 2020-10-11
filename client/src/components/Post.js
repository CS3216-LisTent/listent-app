import React, { useState, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";

// Custom components
import AudioDetails from "./AudioDetails";
import AudioPlayer from "./AudioPlayer";
import Comments from "./Comments";
import ShareDrawer from "./ShareDrawer";
import SingleLineContainer from "./SingleLineContainer";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

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
  loadingBackdrop: {
    zIndex: theme.zIndex.modal,
  },
}));

export default function Post({
  audioRef,
  post,
  next,
  previous,
  hideNext,
  hidePrevious,
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

  return (
    <div className={classes.root}>
      <ShareDrawer isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
      <div className={classes.likeShareContainer}>
        <LikeButton post={post} />
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
            <Comments postId={post._id} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

function LikeButton({ post }) {
  const { data, mutate } = useSwr(`/api/v1/posts/${post._id}`);
  const likedBy = data.data.liked_by;
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hasLiked = user && likedBy.includes(user.username);

  const onClick = async () => {
    if (!user) {
      dispatch(
        openSnackbar("You need to be signed in to like posts!", "warning")
      );
    } else {
      setIsLoading(true);
      await axios.post(
        `/api/v1/posts/${post._id}/${hasLiked ? "unlike" : "like"}`
      );
      mutate();
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <IconButton onClick={onClick} classes={{ label: classes.likeButton }}>
        {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        <Typography variant="caption">{likedBy.length}</Typography>
      </IconButton>
    </>
  );
}
