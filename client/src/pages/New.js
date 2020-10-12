import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import isEmpty from "validator/lib/isEmpty";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
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
// eslint-disable-next-line
import TsEBMLEngine from "videojs-record/dist/plugins/videojs.record.ts-ebml.js";

// Custom components
import AudioPlayer from "../components/AudioPlayer";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { openSnackbar } from "../actions/snackbar-actions";

// Utils
import { newPostErrors } from "../utils/validators";

WaveSurfer.microphone = MicrophonePlugin;

const CHAR_LIMIT = 200;

const isChrome = !!window.chrome;

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
    paddingBottom: theme.spacing(8),
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
  red: {
    color: "#FF0000",
  },
  loadingBackdrop: {
    zIndex: theme.zIndex.modal,
  },
}));

export default function New() {
  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(1));
  }, [dispatch]);

  const recordRef = useRef(null);
  const [player, setPlayer] = useState(null);

  const [recordedBlob, setRecordedBlob] = useState(null);
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
            convertEngine: "ts-ebml",
          },
        },
      };

      const player = videojs("myAudio", options);
      setPlayer(player);

      player.on("finishRecord", function () {
        setIsLoading(true);
      });

      player.on("finishConvert", () => {
        setIsLoading(false);
        setRecordedBlob(
          new File([player.convertedData], player.convertedData.name, {
            type: player.convertedData.type,
          })
        );
      });

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
    setErrors({});
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
    setErrors({});
    setUploadedFiles({
      ...uploadedFiles,
      [type]: { blob: null, url: null },
    });
  };

  const canPost =
    (uploadedFiles.audio.blob || recordedBlob) &&
    !isEmpty(fields.title, { ignore_whitespace: true });

  const username = useSelector((state) => state.user.username);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const onPost = async () => {
    setIsLoading(true);
    let audioBlob = recordedBlob;
    if (uploadedFiles.audio.blob) {
      // User chose to upload audio
      audioBlob = uploadedFiles.audio.blob;
    }

    const imageBlob = uploadedFiles.image.blob;
    const { title, description } = fields;

    const err = await newPostErrors(title, audioBlob, imageBlob);
    if (err) {
      setErrors(err);
      setIsLoading(false);
      return;
    }

    try {
      const form = new window.FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("audio", audioBlob);
      if (imageBlob) {
        form.append("image", imageBlob);
      }
      await axios.post("/api/v1/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(openSnackbar("Audio posted!", "success"));
      history.push(`/${username}`);
    } catch (e) {
      dispatch(
        openSnackbar("An unspecified error occurred, please try again", "error")
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">Create a new post</Typography>
              </Grid>
              <Grid item>
                <Button
                  disabled={!canPost}
                  onClick={onPost}
                  variant="text"
                  color="secondary"
                  size="large"
                >
                  Post
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.audioRecorderContainer}>
              {isChrome ? (
                <audio
                  ref={recordRef}
                  id="myAudio"
                  className={clsx(
                    "video-js vjs-default-skin",
                    classes.audioRecorder
                  )}
                ></audio>
              ) : (
                <Typography variant="caption">
                  Audio recording does not work on your browser, upload an audio
                  file instead!
                  <br />
                </Typography>
              )}
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
            <Typography
              variant="caption"
              className={clsx(errors.audio && classes.red)}
            >
              {errors.audio
                ? errors.audio
                : "*Audio recorded or uploaded cannot exceed 12 minutes and must be less than 25MB"}
            </Typography>
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
          <Grid item xs={12}>
            <Typography
              variant="caption"
              className={clsx(errors.image && classes.red)}
            >
              {errors.image
                ? errors.image
                : "*Image uploaded cannot exceed 10 MB"}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
