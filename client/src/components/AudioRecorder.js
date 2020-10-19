import React, { useRef, useState } from "react";
import RecordRTC from "recordrtc";

// Utils
import injectMetadata from "../utils/inject-metadata";

// Custom components
import AudioPlayer from "../components/AudioPlayer";

const isEdge =
  navigator.userAgent.indexOf("Edge") !== -1 &&
  (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let microphone = null;
let recorder = null;

export default function AudioRecorder() {
  const [audioSrc, setAudioSrc] = useState(null);

  const captureMicrophone = (callback) => {
    if (microphone) {
      callback(microphone);
      return;
    }

    if (
      typeof navigator.mediaDevices === "undefined" ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert(
        "Placeholder This browser does not supports WebRTC getUserMedia API."
      );

      if (!!navigator.getUserMedia) {
        alert(
          "Placeholder This browser seems supporting deprecated getUserMedia API."
        );
      }
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
          alert("Placeholder permission denied");
        } else {
          alert(
            "Placeholder Unable to capture your microphone. Please check console logs."
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
    if (isSafari) {
      setAudioSrc(URL.createObjectURL(recorder.getBlob()));
      releaseMicrophone();
    } else {
      injectMetadata(recorder.getBlob()).then((seekableBlob) => {
        setAudioSrc(URL.createObjectURL(seekableBlob));
        if (isSafari) {
          releaseMicrophone();
        }
      });
    }
  };

  const startRecording = () => {
    if (!microphone) {
      captureMicrophone((mic) => {
        microphone = mic;

        if (isSafari) {
          alert(
            "Please click start recording button again. First time we tried to access your microphone. Now we will record it."
          );
          return;
        }

        startRecording();
      });
    }

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
  };

  const stopRecording = () => {
    recorder.stopRecording(stopRecordingCallback);
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {audioSrc && <AudioPlayer src={audioSrc} hideNext hidePrevious />}
    </div>
  );
}

function RecordButton({ isRecording, startRecord, endRecord }) {}
