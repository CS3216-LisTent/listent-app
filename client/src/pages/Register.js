import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI components
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Other components
import { Link as LinkRouter } from "react-router-dom";

// Custom components
import LoadingButton from "../components/LoadingButton";

// Actions
import { openSnackbar } from "../actions/snackbar-actions";

// Utils
import { registerErrors } from "../utils/validators";

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

export default function Register() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  const [fields, setFields] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setErrors({});
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, username, password, password2 } = fields;
    const err = registerErrors(email, username, password, password2);

    if (err) {
      setFields({ ...fields, password: "", password2: "" });
      setErrors(err);
      setIsLoading(false);
      return;
    }

    try {
      const form = new window.FormData();
      form.append("username", username);
      form.append("password", password);
      form.append("email", email);
      await axios.post("/api/v1/auth/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(
        openSnackbar("Check your email to verify your account!", "success")
      );
      history.push("/login");
    } catch (e) {
      const res = e.response.data;
      setFields({ ...fields, password: "", password2: "" });

      if (res.message.includes("already exists")) {
        setErrors({
          email: "Email already in use",
        });
      }

      if (res.message.includes("The provided id is already in use.")) {
        setErrors({
          username: "Username already in use",
        });
      }

      if (res.message.includes("is too weak")) {
        setErrors({
          password:
            "Password should be at least 8 characters long, include lower case, uppercase, and numbers, and include a special character",
          password2:
            "Password should be at least 8 characters long, include lower case, uppercase, and numbers, and include a special character",
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChange}
                value={fields.email}
                error={errors.email !== undefined}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                onChange={onChange}
                value={fields.username}
                error={errors.username !== undefined}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={onChange}
                value={fields.password}
                error={errors.password !== undefined}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                onChange={onChange}
                value={fields.password2}
                error={errors.password2 !== undefined}
                helperText={errors.password2}
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            isLoading={isLoading}
          >
            Register
          </LoadingButton>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={LinkRouter} to="/login" variant="body2">
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
