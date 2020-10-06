import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core/styles";

// Material UI components
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Icons
import DeleteIcon from "@material-ui/icons/Delete";

// VideoJS
import "video.js/dist/video-js.min.css";
import "videojs-record/dist/css/videojs.record.css";
import "videojs-wavesurfer/dist/css/videojs.wavesurfer.css";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.js";
// eslint-disable-next-line
import Record from "videojs-record/dist/videojs.record.js";
// eslint-disable-next-line
import RecordRTC from "recordrtc";
import WaveSurfer from "wavesurfer.js";
// eslint-disable-next-line
import Wavesurfer from "videojs-wavesurfer/dist/videojs.wavesurfer.js";
import videojs from "video.js";

// Custom components
import AudioPlayer from "../components/AudioPlayer";

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

WaveSurfer.microphone = MicrophonePlugin;

const CHAR_LIMIT = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: ({ uploadedFiles }) => {
      return uploadedFiles.image.url
        ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${uploadedFiles.image.url})`
        : "";
    },
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center center",
    minHeight: "calc(100vh - 48px)",
    backgroundSize: "cover",
    paddingBottom: theme.spacing(2),
  },
  audioRecorder: {
    backgroundColor: theme.palette.background.default + "!important",
    borderStyle: "solid!important",
  },
  audioRecorderContainer: {
    display: ({ uploadedFiles }) =>
      uploadedFiles.audio.blob ? "none" : "block",
    "& .vjs-record .vjs-device-button.vjs-control": {
      zIndex: 1,
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5em",
      },
    },
    "& .vjs-record-button.vjs-control.vjs-button.vjs-icon-record-start": {
      color: "#FF0000",
    },
  },
  input: {
    display: "none",
  },
  audioUploadContainer: {
    display: ({ uploadedFiles }) =>
      uploadedFiles.audio.blob ? "block" : "none",
  },
}));

export default function New() {
  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(1));
  }, [dispatch]);

  const audioRef = useRef(null);
  const recordRef = useRef(null);
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (recordRef.current) {
      const options = {
        controls: true,
        bigPlayButton: false,
        aspectRatio: "10:3",
        fluid: true,
        controlBar: {
          // hide fullscreen control
          fullscreenToggle: false,
        },
        plugins: {
          wavesurfer: {
            backend: "WebAudio",
            waveColor: theme.palette.primary.main,
            progressColor: theme.palette.background.default,
            debug: true,
            cursorWidth: 1,
            hideScrollbar: true,
            plugins: [
              // enable microphone plugin
              WaveSurfer.microphone.create({
                bufferSize: 4096,
                numberOfInputChannels: 1,
                numberOfOutputChannels: 1,
                constraints: {
                  video: false,
                  audio: true,
                },
              }),
            ],
          },
          record: {
            audio: true,
            video: false,
            maxLength: 720,
            displayMilliseconds: true,
          },
        },
      };

      const player = videojs("myAudio", options);
      setPlayer(player);

      return () => {
        player.dispose();
      };
    }
  }, [recordRef, theme]);

  const [fields, setFields] = useState({ title: "", description: "" });
  const onChange = (e) => {
    if (e.target.value.length <= 200) {
      setFields({ ...fields, [e.target.name]: e.target.value });
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState({
    audio: { blob: null, url: null },
    image: { blob: null, url: null },
  });
  const classes = useStyles({ uploadedFiles });
  const onUpload = (e) => {
    if (e.target.files.length === 1) {
      if (e.target.name === "audio") {
        player.wavesurfer().surfer.stop();
        player.record().stopDevice();
      }

      const file = e.target.files[0];
      setUploadedFiles({
        ...uploadedFiles,
        [e.target.name]: { blob: file, url: URL.createObjectURL(file) },
      });

      e.target.value = null;
      return false;
    }
  };

  const removeUpload = (type) => {
    setUploadedFiles({
      ...uploadedFiles,
      [type]: { blob: null, url: null },
    });
  };

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Create a new post</Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.audioRecorderContainer}>
              <audio
                ref={recordRef}
                id="myAudio"
                className={clsx(
                  "video-js vjs-default-skin",
                  classes.audioRecorder
                )}
              ></audio>
              <input
                name="audio"
                accept="audio/*"
                className={classes.input}
                id="audio-upload"
                type="file"
                onChange={onUpload}
              />
              <label htmlFor="audio-upload">
                <Button component="span">Upload an audio file instead</Button>
              </label>
            </div>
            {uploadedFiles.audio.blob && (
              <div className={classes.audioUploadContainer}>
                <AudioPlayer
                  audioRef={audioRef}
                  src={uploadedFiles.audio.url}
                  hideNext
                  hidePrevious
                />
                <Button onClick={() => removeUpload("audio")} component="span">
                  Record audio instead
                </Button>
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              required
              variant="filled"
              onChange={onChange}
              value={fields.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              helperText={`${fields.description.length} / ${CHAR_LIMIT} characters`}
              label="Description"
              multiline
              name="description"
              rows={4}
              variant="filled"
              onChange={onChange}
              value={fields.description}
            />
          </Grid>
          <Grid item>
            <input
              name="image"
              accept="image/*"
              className={classes.input}
              id="image-upload"
              type="file"
              onChange={onUpload}
            />
            {!uploadedFiles.image.blob ? (
              <label htmlFor="image-upload">
                <Button variant="contained" color="primary" component="span">
                  Upload image (Optional)
                </Button>
              </label>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => removeUpload("image")}
              >
                Remove image
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
