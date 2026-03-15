import { FeedbackCase, type TRule } from "@/Shared/models";

export const loginRules: TRule[] = [
  {
    find: "Invalid login credentials",
    message: "Invalid email or password.",
    feedbackCase: FeedbackCase.ERROR,
  },
  {
    find: "Email not confirmed",
    message: "Please confirm your email before signing in.",
    feedbackCase: FeedbackCase.ERROR,
  },
  {
    find: "Signup disabled",
    message: "Sign up is currently disabled.",
    feedbackCase: FeedbackCase.ERROR,
  },
  {
    find: "Invalid email",
    message: "Invalid email address",
    feedbackCase: FeedbackCase.ERROR,
  },
  {
    find: "too many requests",
    message: "Too many failed attempts. Please try again later.",
    feedbackCase: FeedbackCase.ERROR,
  },
];
