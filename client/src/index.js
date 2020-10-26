import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { SWRConfig } from "swr";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { linkify } from "react-linkify";
import App from "./App";
import store from "./store";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

linkify.add("#", {
  validate: function (text, pos, self) {
    var tail = text.slice(pos);

    if (!self.re.twitter) {
      self.re.twitter = new RegExp(
        "^([a-zA-Z0-9_]){1,15}(?!_)(?=$|" + self.re.src_ZPCc + ")"
      );
    }
    if (self.re.twitter.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === "#") {
        return false;
      }
      return tail.match(self.re.twitter)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url = `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://listent.app"
    }/search/tags/${match.url.replace(/^#/, "")}`;
  },
});

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

        // React joyride hide close button
        "button[title='Close']": {
          display: "none",
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
