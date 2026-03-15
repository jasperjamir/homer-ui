export interface MarketingPrompt {
  id: string;
  name: string;
  prompt_text: string | null;
  created_at: string;
  updated_at: string;
}

export type MarketingPromptInsert = Omit<
  MarketingPrompt,
  "id" | "created_at" | "updated_at"
>;
export type MarketingPromptUpdate = Partial<Pick<MarketingPrompt, "name" | "prompt_text">>;
