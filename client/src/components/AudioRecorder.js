import React, { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

// Material UI components
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Icons
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopIcon from "@material-ui/icons/Stop";

// Utils
import injectMetadata from "../utils/inject-metadata";
import { formatSeconds } from "../utils/general-utils";

// Custom components
import AudioPlayer from "../components/AudioPlayer";

// Redux
import { useDispatch } from "react-redux";
import { openAlert } from "../actions/alert-actions";

const useStyles = makeStyles((theme) => ({
  error: {
    borderStyle: "solid",
    borderColor: theme.palette.error.main,
    padding: theme.spacing(1),
  },
  red: { color: "#FF0000" },
  errorText: { color: theme.palette.error.main },
}));

const isEdge =
  navigator.userAgent.indexOf("Edge") !== -1 &&
  (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let microphone = null;
let recorder = null;

export default function AudioRecorder() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [audioSrc, setAudioSrc] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordDisabled, setIsRecordDisabled] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(
    () => () => {
      microphone = null;
      recorder = null;
    },
    []
  );

  const captureMicrophone = (callback) => {
    if (microphone) {
      callback(microphone);
      return;
    }

    if (
      typeof navigator.mediaDevices === "undefined" ||
      !navigator.mediaDevices.getUserMedia
    ) {
      dispatch(
        openAlert(
          "This browser does not support audio recording.",
          "Please update your browser."
        )
      );

      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: isEdge
          ? true
          : {
              echoCancellation: false,
            },
      })
      .then((mic) => {
        callback(mic);
      })
      .catch((error) => {
        if (error.message === "Permission denied") {
          setErrors(
            "Microphone permission denied. Please enable the site access to your microphone before refreshing this page."
          );
        } else {
          setErrors(
            "An unspecified error occurred. Please refresh the page and try again."
          );
        }
      });
  };

  const releaseMicrophone = () => {
    if (microphone) {
      microphone.stop();
      microphone = null;
    }
  };

  const stopRecordingCallback = () => {
    if (isSafari || isEdge) {
      setAudioSrc(URL.createObjectURL(recorder.getBlob()));

      if (isSafari) {
        releaseMicrophone();
      }
    } else {
      injectMetadata(recorder.getBlob()).then((seekableBlob) => {
        setAudioSrc(URL.createObjectURL(seekableBlob));
        if (isSafari) {
          releaseMicrophone();
        }
      });
    }
    setIsRecording(false);
  };

  const initializeRecorder = () => {
    const options = {
      type: "audio",
      numberOfAudioChannels: isEdge ? 1 : 2,
      checkForInactiveTracks: true,
      bufferSize: 16384,
    };

    if (isSafari || isEdge) {
      options.recorderType = RecordRTC.StereoAudioRecorder;
    }

    if (
      navigator.platform &&
      navigator.platform.toString().toLowerCase().indexOf("win") === -1
    ) {
      options.sampleRate = 48000; // or 44100 or remove this line for default
    }

    if (isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 4096;
      options.numberOfAudioChannels = 2;
    }

    if (recorder) {
      recorder.destroy();
      recorder = null;
    }

    recorder = RecordRTC(microphone, options);
    recorder.startRecording();
    setIsRecordDisabled(false);
    setAudioSrc(null);
    setIsRecording(true);
  };

  const startRecording = () => {
    setIsRecordDisabled(true);
    if (!microphone) {
      captureMicrophone((mic) => {
        microphone = mic;

        if (isSafari) {
          dispatch(
            openAlert(
              'Please click the "START RECORDING" button again',
              "On the first click, we tried to access your microphone. Now we will record it."
            )
          );
          setIsRecordDisabled(false);
          return;
        }

        startRecording();
      });
    }

    if (audioSrc !== null) {
      dispatch(
        openAlert(
          "Overwrite previous recording?",
          "This action will lead to the deletion of your old recording!",
          "OK",
          initializeRecorder,
          "CANCEL",
          () => setIsRecordDisabled(false)
        )
      );
    } else {
      initializeRecorder();
    }
  };

  const stopRecording = () => {
    recorder.stopRecording(stopRecordingCallback);
  };

  return (
    <div className={clsx(errors && classes.error)}>
      {audioSrc && <AudioPlayer src={audioSrc} hideNext hidePrevious />}
      <RecordButtons
        isRecording={isRecording}
        startRecord={startRecording}
        endRecord={stopRecording}
        isRecordDisabled={isRecordDisabled}
      />
      {errors && (
        <Typography
          component="p"
          className={classes.errorText}
          variant="caption"
        >
          {errors}
        </Typography>
      )}
    </div>
  );
}

function RecordButtons({
  isRecording,
  startRecord,
  endRecord,
  isRecordDisabled,
}) {
  const classes = useStyles();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isRecording && seconds !== 0) {
      setSeconds(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, seconds]);

  useEffect(() => {
    if (seconds >= 720) {
      // Stop in 12 mins
      endRecord();
    }
  }, [seconds, endRecord]);

  if (!isRecording) {
    return (
      <Button
        variant="contained"
        disabled={isRecordDisabled}
        startIcon={<FiberManualRecordIcon className={classes.red} />}
        onClick={startRecord}
      >
        Start Recording
      </Button>
    );
  } else {
    return (
      <Button
        variant="contained"
        startIcon={<StopIcon className={classes.red} />}
        onClick={endRecord}
      >
        {`Stop Recording ${formatSeconds(seconds)}`}
      </Button>
    );
  }
}
