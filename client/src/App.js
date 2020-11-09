import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Utils
import jwt_decode from "jwt-decode";

// Redux
import store from "./store";
import { setUser, logoutUser } from "./actions/auth-actions";
import { setAdditionalPayloads } from "./actions/auth-actions";

// Custom components
import Alert from "./components/Alert";
import BackButton from "./components/BackButton";
import BottomNavigationBar from "./components/BottomNavigationBar";
import LoadingCenter from "./components/LoadingCenter";
import TopSnackbar from "./components/TopSnackbar";
import RootPlayer from "./components/RootPlayer";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const New = lazy(() => import("./pages/New"));
const Notifications = lazy(() => import("./pages/Notifications"));
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

const useStyles = makeStyles({
  root: { height: (windowHeight) => windowHeight - 56 },
});

function App() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const classes = useStyles(windowHeight);

  const [hasSetPayloads, setHasSetPayloads] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    // Set other login data
    if (user && !hasSetPayloads) {
      dispatch(setAdditionalPayloads(user.username));
      setHasSetPayloads(true);
    }
  }, [dispatch, user, hasSetPayloads]);

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
      <Suspense fallback={<span></span>}>
        <RootPlayer />
      </Suspense>
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/search/:section/:query?">
            <Search />
          </Route>
          <Route exact path="/new">
            <New />
          </Route>
          <Route exact path="/notifications">
            <Notifications />
          </Route>
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
