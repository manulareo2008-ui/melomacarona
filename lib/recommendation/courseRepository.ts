import type { InternationalCourse } from "@/lib/coursesData";
import type { GeneralArea, Modality } from "@/lib/domain";
import {
  didLastGetCoursesByFilterUseFallback,
  getCoursesByFilter,
  toInternationalCourse,
} from "@/lib/supabase/courses";

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
  const courses = await getCoursesByFilter({
    area: input.area,
    modalidade: input.modalidade,
    maxPrice: input.budget,
  });

  const converted = courses.map(toInternationalCourse).slice(0, maxRows);
  if (converted.length === 0 && didLastGetCoursesByFilterUseFallback()) {
    console.warn(
      "getCoursesForRag returned no courses while using fallback from local INTERNATIONAL_COURSES."
    );
  }
  return converted;
}
