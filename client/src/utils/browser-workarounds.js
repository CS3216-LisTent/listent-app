/* eslint-disable */
/* workaround browser issues */
import RecordRTC from "recordrtc";


var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var isEdge = /Edge/.test(navigator.userAgent);
var isOpera = !!window.opera || navigator.userAgent.indexOf("OPR/") !== -1;

if (typeof MediaRecorder === "undefined") {
}

export default function applyAudioWorkaround(options) {
  if (isSafari || isEdge) {
    if (isSafari && window.MediaRecorder !== undefined) {
      // this version of Safari has MediaRecorder
      return;
    }

    // support recording in safari 11/12
    // see https://github.com/collab-project/videojs-record/issues/295
    options.plugins.record.audioRecorderType = RecordRTC.StereoAudioRecorder;
    options.plugins.record.audioSampleRate = 44100;
    options.plugins.record.audioBufferSize = 4096;
    options.plugins.record.audioChannels = 2;

    console.log("applied audio workarounds for this browser");
  }
}
