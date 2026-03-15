import { z } from "zod";

export const departmentSchema = z.enum([
  "Overall",
  "HR",
  "Finance",
  "MedOps",
  "BusinessOps",
  "Tech",
  "Legal",
  "Partnerships",
  "PM",
  "Management",
]);

export const taskStatusSchema = z.enum([
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Off track",
  "At-risk",
]);

export const taskPointsSchema = z.enum(["0.5", "1", "2", "3", "5"]);
