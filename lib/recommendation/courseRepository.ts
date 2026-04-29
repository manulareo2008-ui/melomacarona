import type { InternationalCourse } from "@/lib/coursesData";
import { INTERNATIONAL_COURSES } from "@/lib/coursesData";
import type { GeneralArea, Modality } from "@/lib/domain";

export type CourseRetrievalInput = {
  area: GeneralArea;
  budget: number;
  modalidade: Modality;
  maxRows?: number;
};

export async function getCoursesForRag(
  input: CourseRetrievalInput
): Promise<InternationalCourse[]> {
  const maxRows = input.maxRows ?? 120;

  // Query pre-filter para reduzir custo de tokens e garantir regra de budget.
  // Quando migrar para DB real (Prisma), substitua por:
  // where: { priceBrl: { lte: input.budget }, area: input.area }
  const courses = INTERNATIONAL_COURSES.filter(
    (course) => course.priceBrl <= input.budget && course.area === input.area
  )
    .sort((a, b) => {
      const modalityBoostA = a.modality === input.modalidade ? 0 : 1;
      const modalityBoostB = b.modality === input.modalidade ? 0 : 1;
      if (modalityBoostA !== modalityBoostB) return modalityBoostA - modalityBoostB;
      return a.priceBrl - b.priceBrl;
    })
    .slice(0, maxRows);

  return courses;
}
