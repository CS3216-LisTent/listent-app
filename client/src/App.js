import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Utils
import jwt_decode from "jwt-decode";

// Redux
import store from "./store";
import { setUser, logoutUser } from "./actions/auth-actions";

// Custom components
import BottomNavigationBar from "./components/BottomNavigationBar";
import Can from "./components/Can";
import LoadingCenter from "./components/LoadingCenter";
import PrivateRoute from "./components/PrivateRoute";
import TopSnackbar from "./components/TopSnackbar";

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

const useStyles = makeStyles({
  root: { paddingBottom: (user) => (user ? "56px" : 0) },
});

function App() {
  const user = useSelector((state) => state.user);
  const classes = useStyles(user);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopSnackbar />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <PrivateRoute exact path="/new">
            <New />
          </PrivateRoute>
          <Route exact path="/:username">
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
      <Can
        perform="bottom-navigation:read"
        yes={() => <BottomNavigationBar />}
      />
    </div>
  );
}

export default App;
