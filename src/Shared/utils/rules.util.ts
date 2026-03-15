import { FeedbackCase, type TRule } from "@/Shared/models";

export function findRule(
  error: Error | string,
  rules: TRule[],
  defaultMessage: string = "Internal server error. Please try again later",
) {
  let TextToFind: string;
  if (typeof error === "string") {
    TextToFind = error;
  } else if ("code" in error && typeof error.code === "string") {
    TextToFind = error.code;
  } else if (error instanceof Error) {
    TextToFind = error.message;
  } else {
    TextToFind = "";
  }

  const Found = rules.find((rule) => TextToFind.includes(rule.find));
  if (Found) return Found;

  return { message: defaultMessage, feedbackCase: FeedbackCase.ERROR };
}
