import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Icons
import SendIcon from "@material-ui/icons/Send";

// Utils
import { validateComment } from "../utils/validators";

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
}));

const COMMENTS = [
  {
    username: "nelsontky",
    content: "This is a test comment hello so long short for now.",
  },
  {
    username: "yjpan",
    content: "This is a test comment from Pang Yong Jing",
  },
  {
    username: "dchoo",
    content:
      "This is a test comment from David Choo. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment. This is a test comment.",
  },
  {
    username: "yehez",
    content:
      "This is a test comment from Yehez. YezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasyYezepeasy",
  },
];

export default function Comments() {
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(COMMENTS);
  const [err, setErr] = useState({});

  const submitComment = () => {
    const errors = validateComment(comment);

    if (errors.hasError) {
      setErr({ ...err, comment: errors.comment });
      return;
    }

    setComments([{ username: "nelsontky", content: comment }, ...comments]);
    setComment("");
  };

  const commentChange = (e) => {
    setComment(e.target.value);
    const newErr = delete { ...err }.comment;
    setErr(newErr);
  };

  return (
    <div>
      <TextField
        className={classes.commentInputContainer}
        InputProps={{
          className: classes.commentInput,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={submitComment}>
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
        error={err.comment}
        helperText={err.comment}
        fullWidth
      />
      {comments.map((comment, i) => (
        <Comment
          key={i}
          username={comment.username}
          content={comment.content}
        />
      ))}
    </div>
  );
}

function Comment({ username, content }) {
  const classes = useStyles();

  return (
    <Card className={classes.commentContainer} elevation={0}>
      <CardContent>
        <Grid>
          <Grid item xs={12}>
            <Typography className={classes.username} variant="caption">
              {username}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">{content}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
