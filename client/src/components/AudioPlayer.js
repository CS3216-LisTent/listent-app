import React, { useEffect, useState, useRef } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

// Material UI components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
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

// const VOLUME_STEP = 0.1;
const SKIP_STEP = 10;

const useStyles = makeStyles({
  controls: {
    display: "none",
  },
  center: {
    textAlign: "center",
    margin: "auto 0",
  },
  right: {
    textAlign: "right",
  },
});

export default function AudioPlayer({
  hideNext,
  hidePrevious,
  setRunInstructions,
  postId,
  isPaused,
  src,
  ...rest
}) {
  const dispatch = useDispatch();
  const { audioRef, swipeRef } = useSelector((state) => state.audio);
  const controlsRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [duration, setDuration] = useState(
    audioRef.current ? audioRef.current.duration : 0
  );
  const [progress, setProgress] = useState(
    audioRef.current
      ? Math.floor(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        )
      : 0
  );
  const [currentTime, setCurrentTime] = useState(
    audioRef.current ? audioRef.current.currentTime : 0
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const classes = useStyles(isLoaded);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("sm"));
  const audioRefCheck = audioRef.current === null;
  useEffect(() => {
    if (audioRef.current && controlsRef.current) {
      const audio = audioRef.current;
      const audioControls = controlsRef.current;

      setAudio(audio);

      const loadedMetadataEvent = () => {
        audioControls.style.display = "block";
        setIsLoaded(true);
        setDuration(audio.duration);
      };
      const timeUpdateEvent = () => {
        setCurrentTime(audio.currentTime);
        setProgress(Math.floor((audio.currentTime / audio.duration) * 100));
      };
      if (audio.duration) {
        loadedMetadataEvent();
      } else {
        audio.addEventListener("loadedmetadata", loadedMetadataEvent);
      }
      audio.addEventListener("durationchange", loadedMetadataEvent);
      audio.addEventListener("timeupdate", timeUpdateEvent);

      return () => {
        audio.removeEventListener("loadedmetadata", loadedMetadataEvent);
        audio.removeEventListener("durationchange", loadedMetadataEvent);
        audio.removeEventListener("timeupdate", timeUpdateEvent);
      };
    }
  }, [audioRef, dispatch, audioRefCheck]);

  useEffect(() => {
    if (setRunInstructions && !hideNext && controlsRef.current && isLoaded) {
      setTimeout(() => {
        setRunInstructions(true);
      }, 100);
    }
  }, [setRunInstructions, hideNext, isLoaded]);

  useEffect(() => {
    if (isPaused) {
      audio.pause();
    }
  }, [isPaused, audio]);

  const playPause = () => {
    if (audio.paused || audio.ended) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const changeProgress = (e, value) => {
    e.preventDefault();
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

  const next = () => {
    swipeRef.current.next();
  };

  const previous = () => {
    swipeRef.current.prev();
  };

  return (
    <div className={rest.className}>
      {!isLoaded && <LinearProgress />}
      <Grid container className={classes.controls} ref={controlsRef}>
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
              <Replay10Icon fontSize={isLarge ? "large" : undefined} />
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            {!hidePrevious && (
              <IconButton disabled={!previous} onClick={previous}>
                <SkipPreviousIcon
                  id="audio-previous"
                  fontSize={isLarge ? "large" : undefined}
                />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton onClick={playPause}>
              {!audio || audio.paused ? (
                <PlayArrowIcon fontSize={isLarge ? "large" : undefined} />
              ) : (
                <PauseIcon fontSize={isLarge ? "large" : undefined} />
              )}
            </IconButton>
          </Grid>
          <Grid item xs={2} className={classes.center}>
            {!hideNext && (
              <IconButton disabled={!next} onClick={next}>
                <SkipNextIcon
                  id="audio-next"
                  fontSize={isLarge ? "large" : undefined}
                />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <IconButton onClick={skipForward}>
              <Forward10Icon fontSize={isLarge ? "large" : undefined} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
