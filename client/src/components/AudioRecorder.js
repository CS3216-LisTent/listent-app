import React, { useRef } from "react";
import RecordRTC from "recordrtc";

const isEdge =
  navigator.userAgent.indexOf("Edge") !== -1 &&
  (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let microphone = null;
let recorder = null;

export default function AudioRecorder() {
  const audioRef = useRef(null);

  const captureMicrophone = (callback) => {
    // btnReleaseMicrophone.disabled = false;

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
        // alert(
        //   "Placeholder Unable to capture your microphone. Please check console logs."
        // );
        console.error(error);
      });
  };

  const replaceAudio = (src) => {
    const newAudio = document.createElement("audio");
    newAudio.controls = true;
    newAudio.autoplay = true;

    if (src) {
      newAudio.src = src;
    }

    const parentNode = audioRef.current.parentNode;
    parentNode.innerHTML = "";
    parentNode.appendChild(newAudio);

    audioRef.current = newAudio;
  };

  const releaseMicrophone = () => {
    if (microphone) {
      microphone.stop();
      microphone = null;
    }
  };

  const stopRecordingCallback = () => {
    RecordRTC.getSeekableBlob(recorder.getBlob(), (seekableBlob) => {
      replaceAudio(URL.createObjectURL(seekableBlob));

      setTimeout(() => {
        if (!audioRef.current.paused) return;

        setTimeout(() => {
          if (!audioRef.current.paused) return;
          audioRef.current.play();
        }, 1000);

        audioRef.current.play();
      }, 300);

      audioRef.current.play();

      if (isSafari) {
        releaseMicrophone();
      }
    });
  };

  const startRecording = () => {
    if (!microphone) {
      captureMicrophone((mic) => {
        microphone = mic;

        if (isSafari) {
          replaceAudio();

          audioRef.current.muted = true;
          audioRef.current.srcObject = microphone;

          alert(
            "Please click startRecording button again. First time we tried to access your microphone. Now we will record it."
          );
          return;
        }

        startRecording();
      });
    }

    replaceAudio();

    audioRef.current.muted = true;
    audioRef.current.srcObject = microphone;

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
      <button onClick={releaseMicrophone}>Release Microphone</button>
      <div>
        <audio ref={audioRef} controls autoPlay playsInline></audio>
      </div>
    </div>
  );
}
