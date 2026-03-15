export interface Educator {
  id: string;
  user_id: string;
  unit_id: string | null;
  expertise: string | null;
  years_experience: number | null;
  /** Google Calendar link for mentor slots; add column to DB if not present */
  calendar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type EducatorInsert = Omit<
  Educator,
  "id" | "created_at" | "updated_at"
> & { calendar_url?: string | null };

export type EducatorUpdate = Partial<
  Pick<
    Educator,
    "user_id" | "unit_id" | "expertise" | "years_experience" | "calendar_url"
  >
>;
