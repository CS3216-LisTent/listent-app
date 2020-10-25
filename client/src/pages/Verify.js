import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Custom components
import LoadingButton from "../components/LoadingButton";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

// Utils
import { verifyError } from "../utils/validators";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "hidden",
    marginBottom: theme.spacing(8),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Verify() {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const err = verifyError(username);

    if (err) {
      setErrors(err);
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`/api/v1/auth/send-email-verification/${username}`);
    } catch (e) {
    } finally {
      dispatch(
        openSnackbar(
          "If a user with that username exists, an email would be sent to the user"
        )
      );
      setUsername("");
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Resend verification email
        </Typography>
        <Grid container className={classes.form}>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              required
              fullWidth
              label="Registered username"
              name="login"
              type="text"
              error={errors.username !== undefined}
              helperText={errors.username}
              onChange={(e) => {
                setErrors({});
                setUsername(e.target.value);
              }}
              value={username}
            />
          </Grid>
        </Grid>
        <LoadingButton
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          isLoading={isLoading}
          onClick={onSubmit}
        >
          Resend
        </LoadingButton>
      </div>
    </Container>
  );
}
