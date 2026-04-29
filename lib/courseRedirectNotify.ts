/** Same tab/window as CourseWizard + tab opened with `notify` query param. */
export const COURSE_REDIRECT_BROADCAST = "melomacarona-course-redirect";

export type CourseRedirectNotifyPayload = {
  notifyId: string;
  phase: "redirect" | "error";
};
