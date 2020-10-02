import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import { formatSeconds } from "../utils/general-utils";

const VOLUME_STEP = 0.1;

const useStyles = makeStyles({
  controls: {
    display: "none",
  },
});

export default function AudioPlayer() {
  const classes = useStyles();
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const isSupportAudio = !!document.createElement("audio").canPlayType;
    if (isSupportAudio) {
      const audio = document.getElementById("audio");
      const audioControls = document.getElementById("audio-controls");

      // audio.controls = false;
      audioControls.style.display = "block";

      setAudio(audio);

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        setProgress(Math.floor((audio.currentTime / audio.duration) * 100));
      });
    }
  }, []);

  const playPause = () => {
    if (audio.paused || audio.ended) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const alterVolume = (direction) => {
    if (direction === "+") {
      if (audio.volume + VOLUME_STEP > 1) {
        audio.volume = 1;
      } else {
        audio.volume += VOLUME_STEP;
      }
    } else if (direction === "-") {
      if (audio.volume - VOLUME_STEP < 0) {
        audio.volume = 0;
      } else {
        audio.volume -= VOLUME_STEP;
      }
    }
  };

  const volIncrease = () => {
    alterVolume("+");
  };

  const volDecrease = () => {
    alterVolume("-");
  };

  const changeProgress = (_, value) => {
    setProgress(value);
    audio.currentTime = (audio.duration / 100) * value;
  };

  return (
    <figure id="audio-container">
      <figcaption>Listen to the T-Rex:</figcaption>
      <audio
        preload="metadata"
        id="audio"
        controls
        src={`${process.env.PUBLIC_URL}/coffin.mp3`}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>

      <ul id="audio-controls" className={classes.controls}>
        <li>
          <button onClick={playPause} id="play-pause" type="button">
            Play/Pause
          </button>
        </li>
        <li>
          <Slider value={progress} onChange={changeProgress} />
        </li>
        <li>{formatSeconds(currentTime)}</li>
        <li>
          <button onClick={volIncrease} id="vol-inc" type="button">
            Vol+
          </button>
        </li>
        <li>
          <button onClick={volDecrease} id="vol-dec" type="button">
            Vol-
          </button>
        </li>
      </ul>
    </figure>
  );
}
