import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
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

// Utils
import { setBottomNavigationIndex } from "../actions/bottom-navigation-actions";

WaveSurfer.microphone = MicrophonePlugin;

export default function RecordPage() {
  const theme = useTheme();
  const options = {
    controls: true,
    bigPlayButton: false,
    aspectRatio: "10:3",
    fluid: true,
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
        maxLength: 20,
        displayMilliseconds: true,
      },
    },
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomNavigationIndex(1));
  }, [dispatch]);

  const recordRef = useRef(null);

  useEffect(() => {
    if (recordRef.current) {
      const player = videojs("myAudio", options);

      return () => {
        player.dispose();
      };
    }
  }, [recordRef, options]);

  return (
    <div>
      <h1>Record</h1>
      <div style={{ width: "50%" }}>
        <audio
          ref={recordRef}
          id="myAudio"
          className="video-js vjs-default-skin"
        ></audio>
      </div>
    </div>
  );
}
