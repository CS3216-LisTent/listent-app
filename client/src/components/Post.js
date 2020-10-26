import React, { useState, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
import useSwr from "swr";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";

// Icons
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";

// Custom components
import AudioDetails from "./AudioDetails";
import AudioPlayer from "./AudioPlayer";
import Can from "./Can";
import Comments from "./Comments";
import ShareDrawer from "./ShareDrawer";
import SingleLineContainer from "./SingleLineContainer";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";
import { openAlert } from "../actions/alert-actions";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(7),
    backgroundImage: ({ imageUrl }) =>
      `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
        imageUrl ? imageUrl : ""
      })`,
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
    zIndex: theme.zIndex.speedDial,
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
  loadingTextContainer: {
    position: "absolute",
    top: "calc(50% - 16px)",
    width: "100%",
  },
  loadingText: {
    textAlign: "center",
  },
}));

export default function Post({
  postId,
  next,
  previous,
  hideNext,
  hidePrevious,
  autoplay,
  autopause,
  startSlide,
  index,
  setRunInstructions,
}) {
  const isRender =
    startSlide && index ? Math.abs(startSlide - index) <= 1 : true;

  const { data, mutate } = useSwr(isRender ? `/api/v1/posts/${postId}` : null);

  const post = data && data.data;
  const [isCommentScrolled, setIsCommentScrolled] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const classes = useStyles(
    post ? { imageUrl: post.image_link, isCommentScrolled } : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const commentsRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!isRender) {
    return (
      <div className={classes.loadingTextContainer}>
        <Typography className={classes.loadingText} variant="h6">
          Loading...
        </Typography>
      </div>
    );
  }

  const onCommentsScroll = () => {
    if (commentsRef.current && commentsRef.current.scrollTop > 5) {
      setIsCommentScrolled(true);
    } else {
      setIsCommentScrolled(false);
    }
  };

  return (
    <>
      {hideNext && (
        <Helmet>
          <title>{post.title}</title>
        </Helmet>
      )}
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <div className={classes.root}>
        <ShareDrawer
          isOpen={isShareOpen}
          setIsOpen={setIsShareOpen}
          postId={post._id}
        />
        <div className={classes.likeShareContainer}>
          <Can
            perform="any:delete"
            data={{ owner: post.username }}
            yes={() => (
              <UpdateMenu postId={post._id} setIsLoading={setIsLoading} />
            )}
          />
          <LikeButton post={post} mutate={mutate} setIsLoading={setIsLoading} />
          <IconButton onClick={() => setIsShareOpen(true)}>
            <ShareIcon />
          </IconButton>
        </div>
        <Container maxWidth="sm" className={classes.container}>
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
                !isCommentScrolled && classes.expand
              )}
            >
              <Grid
                item
                xs={12}
                className={clsx(
                  isCommentScrolled && classes.collapse,
                  !isCommentScrolled && classes.expand
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
                  autoplay={autoplay}
                  autopause={autopause}
                  next={next}
                  previous={previous}
                  hideNext={hideNext}
                  hidePrevious={hidePrevious}
                  src={post.audio_link}
                  isPaused={isPaused}
                  setRunInstructions={setRunInstructions}
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
                mutate={mutate}
                setIsPaused={setIsPaused}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}

function LikeButton({ post, mutate, setIsLoading }) {
  const likedBy = post.liked_by;
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
      <IconButton onClick={onClick} classes={{ label: classes.likeButton }}>
        {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        <Typography variant="caption">{likedBy.length}</Typography>
      </IconButton>
    </>
  );
}

function UpdateMenu({ postId, setIsLoading }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = async () => {
    handleClose();
    setIsLoading(true);
    await axios.delete(`/api/v1/posts/${postId}`);
    dispatch(openSnackbar("Post deleted!", "success"));
    history.push("/");
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            dispatch(
              openAlert(
                "Delete post?",
                "This action is irreversible",
                "Yes",
                onDelete,
                "No",
                () => handleClose()
              )
            );
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
