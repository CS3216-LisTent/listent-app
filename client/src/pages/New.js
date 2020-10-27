import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import isEmpty from "validator/lib/isEmpty";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Prompt } from "react-router-dom";

// Material UI components
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Icons
import DeleteIcon from "@material-ui/icons/Delete";

// Custom components
import AudioRecorder from "../components/AudioRecorder";
import GreenButton from "../components/GreenButton";

// Custom components
import AudioPlayer from "../components/AudioPlayer";
import LoadingBackdrop from "../components/LoadingBackdrop";

// Actions
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";
import { openSnackbar } from "../actions/snackbar-actions";
import { openAlert } from "../actions/alert-actions";

// Utils
import { newPostErrors } from "../utils/validators";

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
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(6),
  },
  input: {
    position: "absolute",
    top: "-100px",
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
  uploadButton: {
    marginTop: theme.spacing(1),
  },
}));

export default function New() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(2));
  }, [dispatch]);

  const [recordedBlob, setRecordedBlob] = useState(null);
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

  const [allowUpload, setAllowUpload] = useState(false);
  useEffect(() => {
    if (allowUpload) {
      document.getElementById("audio-upload").click();
      setAllowUpload(false);
    }
  }, [allowUpload]);
  const onClickUpload = (e) => {
    if (!allowUpload && recordedBlob) {
      e.preventDefault();
      dispatch(
        openAlert(
          "Overwrite previous recording?",
          "This action will lead to the deletion of your previous recording!",
          "OK",
          () => {
            setAllowUpload(true);
          },
          "CANCEL"
        )
      );
    }
  };

  const [conversionProgress, setConversionProgress] = useState(0);
  const [isChipmunk, setIsChipmunk] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const isHalfFilled =
    isRecording ||
    uploadedFiles.audio.blob ||
    recordedBlob ||
    uploadedFiles.image.blob ||
    !isEmpty(fields.title, { ignore_whitespace: true }) ||
    !isEmpty(fields.description, { ignore_whitespace: true });
  return (
    <div className={classes.root}>
      <Prompt
        when={isHalfFilled}
        message={(location) =>
          location.pathname.startsWith("/new")
            ? true
            : "Are you sure you want to leave? Unsaved changes will be lost!"
        }
      />
      <Backdrop className={classes.loadingBackdrop} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
      <LoadingBackdrop
        isLoading={conversionProgress !== 0}
        progress={conversionProgress}
      />
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">Create a new post</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {!uploadedFiles.audio.blob && (
              <>
                <AudioRecorder
                  setRecordedBlob={setRecordedBlob}
                  hasRecorded={!!recordedBlob}
                  setConversionProgress={setConversionProgress}
                  isChipmunk={isChipmunk}
                  setRecording={setIsRecording}
                />
                <Collapse in={!isRecording}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChipmunk}
                          onChange={() => setIsChipmunk(!isChipmunk)}
                          color="primary"
                        />
                      }
                      label="CHIPMUNK MODE"
                    />
                  </FormGroup>
                </Collapse>
                <Collapse in={!isChipmunk}>
                  <input
                    name="audio"
                    accept="audio/*"
                    className={classes.input}
                    id="audio-upload"
                    type="file"
                    onChange={onUpload}
                  />
                  <label htmlFor="audio-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      className={classes.uploadButton}
                      onClick={onClickUpload}
                    >
                      Upload an audio file instead
                    </Button>
                  </label>
                </Collapse>
              </>
            )}
            {uploadedFiles.audio.blob && (
              <div className={classes.audioUploadContainer}>
                <AudioPlayer
                  src={uploadedFiles.audio.url}
                  hideNext
                  hidePrevious
                />
                <Button
                  variant="outlined"
                  onClick={() => removeUpload("audio")}
                  component="span"
                >
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
                : isChipmunk
                ? "*Audio recorded in chipmunk mode cannot exceed 20 seconds"
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
              label="Description (Optional)"
              multiline
              name="description"
              rows={4}
              variant="filled"
              onChange={onChange}
              value={fields.description}
            />
          </Grid>
          <Grid item xs={12}>
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
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  fullWidth
                >
                  Add Background Image (Optional)
                </Button>
              </label>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => removeUpload("image")}
                fullWidth
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
          <Grid item xs={12}>
            <GreenButton
              disabled={!canPost}
              onClick={onPost}
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
            >
              Post
            </GreenButton>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
