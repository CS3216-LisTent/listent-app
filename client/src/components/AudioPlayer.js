import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

// Icons
import Forward10Icon from "@material-ui/icons/Forward10";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Replay10Icon from "@material-ui/icons/Replay10";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";

// Utils
import { formatSeconds } from "../utils/general-utils";

const VOLUME_STEP = 0.1;
const SKIP_STEP = 10;

const useStyles = makeStyles({
  controls: {
    display: "none",
  },
  center: {
    textAlign: "center",
    margin: "auto 0",
  },
});

export default function AudioPlayer() {
  const classes = useStyles();
  const [audio, setAudio] = useState(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const isSupportAudio = !!document.createElement("audio").canPlayType;
    if (isSupportAudio) {
      const audio = document.getElementById("audio");
      const audioControls = document.getElementById("audio-controls");

      audio.controls = false;
      audioControls.style.display = "block";

      setAudio(audio);

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
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

  const skip = (direction) => {
    if (direction === "+") {
      if (audio.currentTime + SKIP_STEP > audio.duration) {
        audio.currentTime = audio.duration;
      } else {
        audio.currentTime += SKIP_STEP;
      }
    } else if (direction === "-") {
      if (audio.currentTime - SKIP_STEP < 0) {
        audio.currentTime = 0;
      } else {
        audio.currentTime -= SKIP_STEP;
      }
    }
  };

  const skipForward = () => {
    skip("+");
  };

  const skipBackwards = () => {
    skip("-");
  };

  return (
    <figure id="audio-container">
      <audio
        preload="metadata"
        id="audio"
        controls
        src={`${process.env.PUBLIC_URL}/coffin.mp3`}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <Grid container className={classes.controls} id="audio-controls">
        <Grid item container xs={12} justify="center" alignItems="center">
          <Grid item xs={2} className={classes.center}>
            <Typography variant="caption">
              {formatSeconds(currentTime)}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Slider value={progress} onChange={changeProgress} />
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <Typography variant="caption">{formatSeconds(duration)}</Typography>
          </Grid>
        </Grid>
        <Grid item container xs={12} justify="center" wrap="nowrap">
          <Grid item xs={2} className={classes.center}>
            <IconButton onClick={skipBackwards}>
              <Replay10Icon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton>
              <SkipPreviousIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton onClick={playPause}>
              {!audio || audio.paused ? (
                <PlayArrowIcon fontSize="large" />
              ) : (
                <PauseIcon fontSize="large" />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton>
              <SkipNextIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton onClick={skipForward}>
              <Forward10Icon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </figure>
  );
}
