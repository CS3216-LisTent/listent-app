import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Custom components
import LoadingCenter from "./components/LoadingCenter";

// Pages
const Posts = lazy(() => import("./pages/Posts"));

function App() {
  return (
    <>
      <CssBaseline />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/">
            <Posts />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
