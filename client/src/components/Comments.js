import React, { useState } from "react";
import axios from "axios";
import isEmpty from "validator/lib/isEmpty";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Custom components
import Can from "./Can";

// Icons
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "200px",
  },
  content: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    overflowY: "scroll",
  },
  username: {
    fontWeight: theme.typography.fontWeightBold,
  },
  commentContainer: {
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginBottom: theme.spacing(1),
  },
  commentInput: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 40,
  },
  commentInputContainer: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.common.white,
  },
  plainLink: {
    color: theme.palette.common.white,
    textDecoration: "none",
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  loadingBackdrop: {
    zIndex: theme.zIndex.modal,
  },
}));

export default function Comments({ postId, comments, mutate }) {
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitComment = async () => {
    setIsLoading(true);
    await axios.post(
      `/api/v1/posts/${postId}/comment`,
      JSON.stringify({ text: comment })
    );
    setComment("");
    mutate();
    setIsLoading(false);
  };

  const commentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Can
        perform="comments:create"
        yes={() => (
          <TextField
            className={classes.commentInputContainer}
            InputProps={{
              className: classes.commentInput,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={submitComment}
                    disabled={isEmpty(comment, { ignore_whitespace: true })}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            multiline
            rowsMax={4}
            label="Add a comment"
            variant="outlined"
            value={comment}
            onChange={commentChange}
            fullWidth
          />
        )}
        no={() => (
          <Typography variant="body1">
            <Link className={classes.link} to="/login">
              Login
            </Link>{" "}
            or{" "}
            <Link className={classes.link} to="/register">
              register
            </Link>{" "}
            to post a comment!
          </Typography>
        )}
      />
      {comments.length > 0 ? (
        comments.map((comment, i) => (
          <Comment key={i} username={comment.username} text={comment.text} />
        ))
      ) : (
        <Typography className={classes.marginTop} variant="body2">
          No comments yet!
        </Typography>
      )}
    </div>
  );
}

function Comment({ username, text }) {
  const classes = useStyles();

  return (
    <Card className={classes.commentContainer} elevation={0}>
      <CardContent>
        <Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.username}
              variant="caption"
              component={Link}
              className={classes.plainLink}
              to={`/${username}`}
            >
              {username}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">{text}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
