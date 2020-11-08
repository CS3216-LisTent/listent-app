// Redux
import store from "../store";
import { openSnackbar } from "../actions/snackbar-actions";

let workerPath = `https://listent.app/ffmpeg_asm.js`;

function processInWebWorker() {
  let blob = URL.createObjectURL(
    new Blob(
      [
        'importScripts("' +
          workerPath +
          '");let now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {let message = event.data;if (message.type === "command") {let Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});let time = now();let result = ffmpeg_run(Module);let totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});',
      ],
      {
        type: "application/javascript",
      }
    )
  );

  let worker = new Worker(blob);
  URL.revokeObjectURL(blob);
  return worker;
}

let worker;

export default function convertToChipmunk(
  audioBlob,
  setAudioSrc,
  setRecordedBlob,
  setConversionProgress
) {
  let timer = setInterval(() => {
    if (setConversionProgress !== undefined) {
      setConversionProgress((progress) => {
        if (progress % 30 !== 9) {
          return progress + 1;
        }
        return progress;
      });
    }
  }, 1000);

  if (setConversionProgress !== undefined) {
    setConversionProgress(10);
  }

  let aab;
  let buffersReady;

  let fileReader = new FileReader();
  fileReader.onload = function () {
    aab = this.result;
    postMessage();
  };
  fileReader.readAsArrayBuffer(audioBlob);

  if (!worker) {
    worker = processInWebWorker();
  }

  worker.onerror = () => {
    store.dispatch(
      openSnackbar(
        "An unspecified error occurred. Chipmunk mode does not work on your device.",
        "error"
      )
    );
    worker.terminate();
    worker = null;
    if (setConversionProgress !== undefined) {
      setConversionProgress(0);
    }
    clearInterval(timer);
  };

  worker.onmessage = function (event) {
    let message = event.data;
    if (message.type === "ready") {
      console.log(
        '<a href="' +
          workerPath +
          '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.'
      );

      if (setConversionProgress !== undefined) {
        setConversionProgress(50);
      }

      if (buffersReady) postMessage();
    } else if (message.type === "stdout") {
      console.log(message.data);
    } else if (message.type === "start") {
      console.log(
        '<a href="' +
          workerPath +
          '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.'
      );

      if (setConversionProgress !== undefined) {
        setConversionProgress(70);
      }
    } else if (message.type === "done") {
      if (setConversionProgress !== undefined) {
        setConversionProgress(99);
      }

      let result = message.data[0];
      let blob = new File([result.data], "test.wav", {
        type: "audio/wav",
      });

      setAudioSrc(URL.createObjectURL(blob));

      if (setRecordedBlob) {
        setRecordedBlob(blob);
      }

      if (setConversionProgress !== undefined) {
        setConversionProgress(0);
      }
      clearInterval(timer);
    }
  };
  let postMessage = function () {
    worker.postMessage({
      type: "command",
      arguments: "-i audio.wav -af asetrate=44100*(1/0.65),aresample=44100,atempo=0.65 -strict experimental output.wav".split(
        " "
      ),
      files: [
        {
          data: new Uint8Array(aab),
          name: "audio.wav",
        },
      ],
    });
  };
}
