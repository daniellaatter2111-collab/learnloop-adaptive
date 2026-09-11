import { useAppState } from "@/lib/store";
import { materialService } from "@/services/materialService";

export function useMaterials() {
  const { materials } = useAppState();
  return {
    materials,
    uploadMaterial: materialService.uploadMaterial,
    deleteMaterial: materialService.deleteMaterial,
  };
}
