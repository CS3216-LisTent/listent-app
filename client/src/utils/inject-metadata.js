import { Decoder, tools, Reader } from "ts-ebml";

const readAsArrayBuffer = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (ev) => {
      reject(ev.error);
    };
  });
};

export default async function injectMetadata(blob) {
  const decoder = new Decoder();
  const reader = new Reader();
  reader.logging = false;
  reader.drop_default_duration = false;

  const buffer = await readAsArrayBuffer(blob);
  const elms = decoder.decode(buffer);
  elms.forEach((elm) => {
    reader.read(elm);
  });
  reader.stop();
  const refinedMetadataBuf = tools.makeMetadataSeekable(
    reader.metadatas,
    reader.duration,
    reader.cues
  );
  const body = buffer.slice(reader.metadataSize);
  return new Blob([refinedMetadataBuf, body], { type: blob.type });
}
