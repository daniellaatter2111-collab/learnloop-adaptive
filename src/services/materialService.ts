import { getState, setState } from "@/lib/store";
import type { CourseMaterial, MaterialType } from "@/types";

export const materialService = {
  getMaterials(): CourseMaterial[] {
    return getState().materials;
  },

  uploadMaterial(input: {
    title: string;
    subject: string;
    topic: string;
    type: MaterialType;
  }): CourseMaterial {
    const material: CourseMaterial = {
      ...input,
      id: `mat-${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    setState((s) => ({ materials: [material, ...s.materials] }));
    return material;
  },

  deleteMaterial(id: string) {
    setState((s) => ({ materials: s.materials.filter((m) => m.id !== id) }));
  },
};
