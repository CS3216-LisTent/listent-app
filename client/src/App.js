import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Utils
import jwt_decode from "jwt-decode";

// Redux
import store from "./store";
import { setUser, logoutUser } from "./actions/auth-actions";

// Custom components
import LoadingCenter from "./components/LoadingCenter";
import BottomNavigationBar from "./components/BottomNavigationBar";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const New = lazy(() => import("./pages/New"));
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));

// Check for token to keep user logged in
const jwt = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
if (jwt) {
  store.dispatch(setUser(jwt));

  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (jwt_decode(jwt).exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

const useStyles = makeStyles({ root: { paddingBottom: "56px" } });

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/new">
            <New />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
        </Switch>
      </Suspense>
      <BottomNavigationBar />
    </div>
  );
}

export default App;
