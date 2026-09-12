import { useAppState } from "@/lib/store";
import { materialService } from "@/services/materialService";

export function useMaterials() {
  const { materials, user } = useAppState();
  const scopedMaterials =
    user?.role === "admin"
      ? materials.filter((material) => material.teacherId === user.id)
      : materials;
  return {
    materials: scopedMaterials,
    forStudent: (studentId: string | undefined) => {
      if (!studentId) return [];
      return scopedMaterials.filter((material) => material.recipientStudentIds.includes(studentId));
    },
    uploadMaterial: materialService.uploadMaterial,
    deleteMaterial: materialService.deleteMaterial,
  };
}
