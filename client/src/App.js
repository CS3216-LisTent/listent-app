import React, { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Utils
import jwt_decode from "jwt-decode";

// Redux
import store from "./store";
import { setUser, logoutUser } from "./actions/auth-actions";
import { setHomeTabIndex } from "./actions/home-tab-actions";
import { setSeed } from "./actions/seed-actions";

// Custom components
import Alert from "./components/Alert";
import BackButton from "./components/BackButton";
import BottomNavigationBar from "./components/BottomNavigationBar";
import LoadingCenter from "./components/LoadingCenter";
import PrivateRoute from "./components/PrivateRoute";
import TopSnackbar from "./components/TopSnackbar";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const New = lazy(() => import("./pages/New"));
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const Search = lazy(() => import("./pages/Search"));
const SinglePost = lazy(() => import("./pages/SinglePost"));
const Verify = lazy(() => import("./pages/Verify"));

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

// Set home tab
const user = store.getState().user;
if (user) {
  axios
    .get(`/api/v1/users/${user.username}`)
    .then((res) => {
      if (res.data.data.number_of_following > 0) {
        // Default tab is feed
        store.dispatch(setHomeTabIndex(0));
      } else {
        store.dispatch(setHomeTabIndex(1));
      }
    })
    .catch(() => {
      store.dispatch(setHomeTabIndex(1));
    });
} else {
  store.dispatch(setHomeTabIndex(1));
}

// Set discover seed
store.dispatch(setSeed());

const useStyles = makeStyles({
  root: { height: (windowHeight) => windowHeight - 56 },
});

function App() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const classes = useStyles(windowHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <BackButton />
      <TopSnackbar />
      <Alert />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/search/:section/:query?">
            <Search />
          </Route>
          <PrivateRoute exact path="/new">
            <New />
          </PrivateRoute>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/verify">
            <Verify />
          </Route>
          <Route exact path="/post/:id">
            <SinglePost />
          </Route>
          <Route path="/:username">
            <Profile />
          </Route>
        </Switch>
      </Suspense>
      <BottomNavigationBar />
    </div>
  );
}

export default App;
