import type { MobileNet } from "@tensorflow-models/mobilenet";

let modelPromise: Promise<MobileNet> | null = null;

export function normalizeObjectType(value: string) {
  return value.trim().toLowerCase().replace(/_/g, " ");
}

export async function loadOwnerIdentificationModel() {
  if (!modelPromise) {
    modelPromise = Promise.all([
      import("@tensorflow-models/mobilenet"),
      import("@tensorflow/tfjs"),
    ]).then(async ([mobilenet, tf]) => {
      await tf.ready();
      return mobilenet.load({ version: 2, alpha: 1 });
    });
  }
  return modelPromise;
}

export async function extractEmbedding(source: HTMLImageElement | HTMLCanvasElement) {
  const model = await loadOwnerIdentificationModel();
  const tensor = model.infer(source, true);
  const values = Array.from(await tensor.data());
  tensor.dispose();
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  return magnitude ? values.map((value) => value / magnitude) : values;
}

export function cosineSimilarity(left?: number[], right?: number[]) {
  if (!left?.length || !right?.length || left.length !== right.length) return 0;
  let score = 0;
  for (let index = 0; index < left.length; index += 1) score += left[index] * right[index];
  return score;
}

export async function imageFromDataUrl(dataUrl: string) {
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  return image;
}

export async function cropImage(dataUrl: string, area: { x: number; y: number; width: number; height: number }) {
  const image = await imageFromDataUrl(dataUrl);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 320 / Math.max(area.width, area.height));
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  canvas.getContext("2d")?.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}

export async function optimizeReferenceImage(dataUrl: string) {
  const image = await imageFromDataUrl(dataUrl);
  const scale = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}
