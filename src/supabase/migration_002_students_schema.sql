-- Migration: Update students table - remove progress_percent, add current_chapter_id and current_lesson_id
-- Run this if you have an existing database with the old students schema.

-- Add new columns
alter table public.students
  add column if not exists current_chapter_id uuid references public.chapters(id) on delete set null,
  add column if not exists current_lesson_id uuid references public.lessons(id) on delete set null;

-- Remove progress_percent (if it exists)
alter table public.students drop column if exists progress_percent;
