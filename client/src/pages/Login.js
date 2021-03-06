import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// Material UI components
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Other components
import { Link as LinkRouter } from "react-router-dom";

// Custom components
import LoadingButton from "../components/LoadingButton";

// Actions
import { setUser } from "../actions/auth-actions";
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

// Utils
import { loginErrors } from "../utils/validators";

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

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const redirect = useSelector((state) => state.redirect);
  const [isShowResend, setIsShowResend] = useState(false);

  useEffect(() => {
    dispatch(setBottomNavigationIndex(4));
  }, [dispatch]);

  useEffect(() => {
    if (redirect && user) {
      history.push(redirect);
    } else if (user) {
      history.push("/");
    }
  }, [user, history, redirect]);

  const [fields, setFields] = useState({
    login: "",
    password: "",
    isRemember: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setErrors({});
    setFields({
      ...fields,
      [e.target.name]:
        e.target.name === "login"
          ? e.target.value.toLowerCase()
          : e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { login, password } = fields;
    const err = loginErrors(login, password);

    if (err) {
      setFields({ ...fields, password: "" });
      setErrors(err);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/v1/auth/login",
        JSON.stringify({ username: login, password })
      );
      dispatch(setUser(res.data.data.user_token));

      if (fields.isRemember) {
        localStorage.setItem("jwt", res.data.data.user_token);
      } else {
        sessionStorage.setItem("jwt", res.data.data.user_token);
      }
    } catch (e) {
      setFields({ ...fields, password: "" });
      const res = e.response.data;

      if (res.message.includes("User email not verified.")) {
        setIsShowResend(true);
        setErrors({
          login: res.message,
        });
      } else {
        const message = "Login or password invalid";
        setErrors({
          login: message,
          password: message,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                label="Email or Username"
                name="login"
                type="text"
                onChange={onChange}
                value={fields.login}
                error={errors.login !== undefined}
                helperText={errors.login}
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
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                value={fields.isRemember}
                color="primary"
              />
            }
            label="Remember me"
            onChange={() =>
              setFields({ ...fields, isRemember: !fields.isRemember })
            }
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            isLoading={isLoading}
          >
            Log In
          </LoadingButton>
          <Grid container justify="flex-end" spacing={1}>
            <Grid item>
              <Link component={LinkRouter} to="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Grid>
            {isShowResend && (
              <Grid item>
                <Link component={LinkRouter} to="/verify" variant="body2">
                  Resend verification email
                </Link>
              </Grid>
            )}
          </Grid>
        </form>
      </div>
    </Container>
  );
}
