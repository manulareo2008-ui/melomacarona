/** Same tab/window as CourseWizard + tab opened with `notify` query param. */
export const COURSE_REDIRECT_BROADCAST = "atloom-course-redirect";

export type CourseRedirectNotifyPayload = {
  notifyId: string;
  phase: "redirect" | "error";
};
