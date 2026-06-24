import { detectionModules } from "@/data/modules";
import type { DetectionModule, DetectionModuleId } from "@/types/module";

export async function getDetectionModules(): Promise<DetectionModule[]> {
  return detectionModules;
}

export async function getDetectionModule(id: DetectionModuleId): Promise<DetectionModule | undefined> {
  return detectionModules.find((module) => module.id === id);
}
