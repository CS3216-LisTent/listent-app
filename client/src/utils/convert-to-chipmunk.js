// Placeholder
let workerPath = `https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js`;

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

export default function convertStreams(audioBlob, setAudioSrc) {
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

  worker.onmessage = function (event) {
    let message = event.data;
    if (message.type === "ready") {
      console.log(
        '<a href="' +
          workerPath +
          '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.'
      );

      if (buffersReady) postMessage();
    } else if (message.type === "stdout") {
      console.log(message.data);
    } else if (message.type === "start") {
      console.log(
        '<a href="' +
          workerPath +
          '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.'
      );
    } else if (message.type === "done") {
      let result = message.data[0];
      let blob = new File([result.data], "test.wav", {
        type: "audio/wav",
      });
      setAudioSrc(URL.createObjectURL(blob));
    }
  };
  let postMessage = function () {
    worker.postMessage({
      type: "command",
      arguments: "-i audio.wav -acodec pcm_u8 -ar 22050 -af asetrate=44100*(1/0.65),aresample=44100,atempo=0.65 -strict experimental output.wav".split(
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
