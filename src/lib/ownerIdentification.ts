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
