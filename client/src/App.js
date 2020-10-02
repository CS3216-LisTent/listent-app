import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import AudioPlayer from "./components/AudioPlayer";

function App() {
  return (
    <div>
      <CssBaseline />
      <h1>Hello World!</h1>
      <AudioPlayer />
    </div>
  );
}

export default App;
