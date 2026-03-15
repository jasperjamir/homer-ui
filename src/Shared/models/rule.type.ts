export const FeedbackCase = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type FeedbackCase = (typeof FeedbackCase)[keyof typeof FeedbackCase];

export type TRule = {
  find: string;
  message: string;
  feedbackCase: FeedbackCase;
};
