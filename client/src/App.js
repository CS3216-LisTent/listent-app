import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Custom components
import LoadingCenter from "./components/LoadingCenter";
import BottomNavigationBar from "./components/BottomNavigationBar";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Record = lazy(() => import("./pages/Record"));

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
          <Route exact path="/record">
            <Record />
          </Route>
        </Switch>
      </Suspense>
      <BottomNavigationBar />
    </div>
  );
}

export default App;
