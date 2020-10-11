import React, { useState, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
import useSwr from "swr";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

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
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(7),
    backgroundImage: ({ imageUrl }) =>
      imageUrl
        ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`
        : undefined,
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
  postId,
  next,
  previous,
  hideNext,
  hidePrevious,
}) {
  const { data, mutate } = useSwr(`/api/v1/posts/${postId}`);
  const post = data.data;
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

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <div className={classes.root}>
        <ShareDrawer isOpen={isShareOpen} setIsOpen={setIsShareOpen} />
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
                mutate={mutate}
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleClose();
  };

  const onDelete = async () => {
    handleDialogClose();
    setIsLoading(true);
    await axios.delete(`/api/v1/posts/${postId}`);
    dispatch(openSnackbar("Post deleted!", "success"));
    history.push("/");
  };

  return (
    <>
      <div>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogContent>
            <DialogContentText>This action is irreversible!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              No
            </Button>
            <Button onClick={onDelete} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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
              setIsDialogOpen(true);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}
