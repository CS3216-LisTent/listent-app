import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

// Material UI components
import CssBaseline from "@material-ui/core/CssBaseline";

// Custom components
import LoadingCenter from "./components/LoadingCenter";

// Pages
const Post = lazy(() => import("./pages/Post"));

function App() {
  return (
    <>
      <CssBaseline />
      <Suspense fallback={<LoadingCenter />}>
        <Switch>
          <Route exact path="/post">
            <Post imageUrl={`${process.env.PUBLIC_URL}/ChickenWing.jpeg`} />
          </Route>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}

export default App;
