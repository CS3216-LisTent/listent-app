import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { SWRConfig } from "swr";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import App from "./App";
import store from "./store";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00C2FF",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        span: {
          overflowWrap: "break-word",
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url) => axios.get(url).then((res) => res.data),
        suspense: true,
      }}
    >
      <Router>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </Router>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
