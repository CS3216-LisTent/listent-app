import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Custom components
import LoadingCenter from "./components/LoadingCenter";

// Pages
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <>
      <CssBaseline />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
