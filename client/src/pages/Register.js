import React from "react";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
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

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate onSubmit={null}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
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
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                required
                fullWidth
                name="password_confirmation"
                label="Confirm Password"
                type="password"
                id="password_confirmation"
              />
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
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
