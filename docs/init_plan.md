# Full codebase plan: Pillars > Lessons > Activities LMS

## 1. Schema alignment and auth

**Option A (adopted): Supabase for all.**

- Use **Supabase Auth** for login. Resolve current user via `supabase.auth.getUser()`; then fetch `app_users` by `id = auth.user.id`.
- Role comes from `app_users.role`; use it for nav and route guards (and eventually replace or complement `PUBLIC_IS_EDUCATOR` env).
- All data (units, chapters, lessons, activities, students, educators, student_logs, app_users) lives in Supabase. No Firebase or separate API for this domain.

---

## 2. Data layer (Supabase)

**Location:** New feature folders under `src/Features/` plus shared types for DB enums.

### 2.1 Shared types and enums

- **File:** e.g. `src/Shared/models/app-user.type.ts` (or under a dedicated `schema/` folder).
- Define TS types matching the schema:
  - `AppUser` (id, name, email, mobile_number, role, created_at, updated_at).
  - `Unit`, `Chapter`, `Lesson`, `Activity` (ids, FKs, name, description, sort_order, url where applicable, timestamps).
  - `Student` (id, user_id, unit_id, progress_percent, timestamps).
  - `Educator` (id, user_id, unit_id, expertise, years_experience, timestamps).
  - `StudentLog` (id, student_id, activity_id, submission_link, submission_details, submission_date, status, approval_date, approver_id, timestamps).
- Add enums for `app_users.role` (e.g. `STUDENT`, `EDUCATOR`) and `student_log_status` (e.g. `TODO`, `SUBMITTED`, `APPROVED` — match your DB enum).

### 2.2 Supabase services and query-options (by entity)

Use the same pattern as `Features/Users`: **services** (Supabase client calls), **query-options** (TanStack Query with `queryKey` + invalidation), and **models** (types).

| Entity         | Service functions (examples)                                      | Main query-options / mutations                                      |
|----------------|-------------------------------------------------------------------|----------------------------------------------------------------------|
| **App users**  | getAppUser(id), getAppUserByAuthId(authId)                        | getAppUserQueryOptions(id), current user from auth                   |
| **Units**      | getUnits(), getUnitById(id), createUnit, updateUnit, deleteUnit   | getUnitsQueryOptions(), getUnitQueryOptions(id), useCreateUnitMutation, etc. |
| **Chapters**   | getChaptersByUnitId(unitId), getChapterById(id), create, update, delete | getChaptersQueryOptions(unitId), useCreateChapterMutation, etc. |
| **Lessons**    | getLessonsByChapterId(chapterId), getLessonById(id), create, update, delete | getLessonsQueryOptions(chapterId), useCreateLessonMutation, etc. |
| **Activities** | getActivitiesByLessonId(lessonId), getActivityById(id), create, update, delete | getActivitiesQueryOptions(lessonId), useCreateActivityMutation, etc. |
| **Students**   | getStudents(), getStudentsByUnitId(unitId), getStudentByUserId(userId), getStudentById(id) | getStudentsQueryOptions(filters), getStudentByUserIdQueryOptions(userId) |
| **Educators**  | getEducators(), getEducatorsByUnitId(unitId), getEducatorByUserId(userId)  | getEducatorsQueryOptions(), getEducatorByUserIdQueryOptions(userId) |
| **Student logs** | getStudentLogsByStudentId(studentId), getStudentLogsByActivityId(activityId), submitLog, approveLog, updateLog | getStudentLogsQueryOptions(studentId), useSubmitLogMutation, useApproveLogMutation |

- **Progress:** No new tables. Derive “approved activity” from `student_logs` (status = APPROVED). Lesson/chapter “approval” = 100% of child activities/lessons approved; compute in service or in a small helper (or later via DB view/function).
- **Tables:** Use Supabase table names: `app_users`, `units`, `chapters`, `lessons`, `activities`, `students`, `educators`, `student_logs`. Use `src/Shared/lib/supabase.ts` client.

---

## 3. Feature structure (high level)

```
Data layer:  Supabase client + Shared types/enums
     ↓
Features:    Units, Chapters, Lessons, Activities, Students, Educators, StudentLogs, AppUser/Auth
     ↓
Pages:       Student Dashboard, Learning Modules, Educator Dashboard, Students, Learning Module Editor
```

- **Units:** services + query-options + (optional) components for unit card/list.
- **Chapters / Lessons / Activities:** same pattern; services accept parent FK (unit_id, chapter_id, lesson_id).
- **Students / Educators:** services + query-options; used by educator dashboard and Students page.
- **StudentLogs:** services + mutations for submit/approve; used by student view (my submissions) and educator view (student submissions).
- **AppUser / Auth:** resolve current user (and role) from Supabase Auth + `app_users`; expose e.g. `useCurrentAppUser()` and “is educator” for nav and route guards.

---

## 4. Route-to-feature mapping

| Route                     | Purpose                                                                 | Main data                                                                 |
|---------------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `/student-dashboard`      | Student home: my units (pillars), progress summary                     | Units for my unit_id, Student progress, StudentLogs summary               |
| `/learning-modules`       | Student: browse Pillars > Chapters > Lessons > Activities; view links; upload submission | Units → Chapters → Lessons → Activities; StudentLogs (submit)    |
| `/educator-dashboard`     | Educator home: my students, quick stats                                | Students by educator’s unit, progress aggregates                          |
| `/students`               | Educator: list students, open progress/submissions                     | Students, StudentLogs per student                                         |
| `/learning-module-editor` | Educator: map activities → lessons → chapters → units (and create/edit) | Units, Chapters, Lessons, Activities (full CRUD)                           |
| `/educators`              | Educator: list educators (optional)                                    | Educators                                                                 |
| `/users`                  | Existing app users (can later align with `app_users` if you merge)    | Existing Users feature or migrate to app_users                             |

---

## 5. Student view (implementation)

### 5.1 Student Dashboard (`/student-dashboard`)

- Resolve current user → `app_users` → `students` (by `user_id`); get `unit_id` and `progress_percent`.
- **Data:** `getUnitsQueryOptions()` (or filter by student’s unit_id), `getStudentByUserIdQueryOptions(userId)` for progress.
- **UI:** List “My Pillars” (units for that student); show overall progress (e.g. progress_percent); optional link to “Learning Modules”.

### 5.2 Learning Modules (`/learning-modules`)

- **Data:** Units (for student’s unit) → Chapters → Lessons → Activities. For each activity, load existing `StudentLog` (if any) for current student.
- **UI:**
  - Hierarchical tree or accordions: **Pillars (Units)** → **Chapters** → **Lessons** → **Activities**.
  - Per activity: show **name**, **description**, **link** (url: Google Sheets/Docs) and “Open link” button.
  - **Upload:** Form to submit “link to my copy” (and optional details) → create/update `student_logs` (e.g. status SUBMITTED, submission_link, submission_details, submission_date).
  - Show status per activity (TODO / SUBMITTED / APPROVED) from `student_logs`.

### 5.3 View available slots of my mentors

- **Implementation:** Just a **Google Calendar link of educators**. No new table or slots entity. Store a calendar URL on educators (e.g. add `calendar_url` to `educators` if not already present, or use a single shared link). On the student dashboard or a small “Mentor slots” section, show a link that opens the educator’s (or unit’s) Google Calendar (e.g. “Book a slot with your mentor” → opens calendar in new tab).

---

## 6. Educator view (implementation)

### 6.1 Educator Dashboard (`/educator-dashboard`)

- Resolve current user → `app_users` → `educators` (by `user_id`); get `unit_id`.
- **Data:** `getStudentsQueryOptions({ unitId })`, aggregate progress (e.g. list students with progress_percent).
- **UI:** List “My students” with progress; link to Students page for detail.

### 6.2 Students page (`/students`)

- **Data:** Students (filter by educator’s unit), plus per-student logs for progress/submissions.
- **UI:** Table or list of students; click student → show progress (e.g. by unit/chapter/lesson/activity) and list of submissions (same structure as student view: activity, submission_link, status, approval). Reuse a shared “submission list” component if possible.

### 6.3 Learning Module Editor (`/learning-module-editor`)

- **Data:** Full CRUD on Units, Chapters, Lessons, Activities (nested).
- **UI:**
  - List Units (Pillars); add/edit/delete unit.
  - Select unit → list Chapters; add/edit/delete chapter.
  - Select chapter → list Lessons; add/edit/delete lesson.
  - Select lesson → list Activities; add/edit/delete activity; set name, description, **url** (Google Sheets/Docs), sort_order.
  - “Map” = creating/editing the hierarchy (unit → chapter → lesson → activity) and setting activity URLs.

### 6.4 Submissions (educator)

- **Approve flow:** Educator sees student submissions (from `student_logs`); approve button → update `student_logs` (status = APPROVED, approval_date, approver_id). Then recompute student progress (e.g. update `students.progress_percent` or derive on read from logs).

---

## 7. Progress and approval rules (data logic)

- **Approved activity:** `student_logs.status === 'APPROVED'` for that student + activity.
- **Lesson “approved” for a student:** all activities under that lesson have an approved log (or define in code: count activities, count approved logs, equal => lesson done).
- **Chapter “approved”:** all lessons in chapter approved (same idea).
- **Progress %:** Option A: store on `students.progress_percent` and update when a log is approved (e.g. trigger or app logic). Option B: compute from logs (total activities in unit vs approved) when displaying. Implement a small **progress service** (e.g. `getProgressForStudent(studentId, unitId)`) that returns percentages per chapter/lesson and overall; optionally persist to `students.progress_percent` on approve.

---

## 8. File and folder layout (concrete)

- **Shared**
  - `src/Shared/models/` (or `schema/`): `app-user.type.ts`, `unit.type.ts`, `chapter.type.ts`, `lesson.type.ts`, `activity.type.ts`, `student.type.ts`, `educator.type.ts`, `student-log.type.ts`; enum types for role and student_log_status.
- **Features**
  - `Features/AppUser/` or extend `Features/Auth/`: current app user + role (Supabase Auth + app_users).
  - `Features/Units/`: services, query-options, (optional) components.
  - `Features/Chapters/`: same.
  - `Features/Lessons/`: same.
  - `Features/Activities/`: same.
  - `Features/Students/`: same (distinct from existing Users if you keep both).
  - `Features/Educators/`: same.
  - `Features/StudentLogs/`: services, query-options, mutations (submit, approve).
  - Optional: `Features/Progress/`: getProgressForStudent, recompute logic.
- **Pages**
  - `StudentDashboardPage`: use Units + Student (and Progress if you add it).
  - `LearningModulesPage`: use Units → Chapters → Lessons → Activities + StudentLogs (read + submit).
  - `EducatorDashboardPage`: use Students + Educators (by unit).
  - `StudentsPage`: use Students + StudentLogs (list + approve).
  - `LearningModuleEditorPage`: use Units, Chapters, Lessons, Activities (full CRUD).
  - `EducatorsPage`: use Educators (list).
  - Keep or later replace `UsersPage` with app_users if you consolidate.

---

## 9. Implementation order (suggested)

1. **Shared types and enums** for all schema entities.
2. **Supabase services + query-options** for Units, Chapters, Lessons, Activities (so editor and student tree can be built).
3. **AppUser/Auth:** resolve current user and role via Supabase Auth + app_users; hook e.g. `useCurrentAppUser()` and “is educator”.
4. **Students + Educators + StudentLogs** services and query-options/mutations.
5. **Student Dashboard** (units + progress).
6. **Learning Modules** page (tree + activity links + submit flow).
7. **Educator Dashboard** (students list + progress).
8. **Students page** (list + per-student submissions + approve).
9. **Learning Module Editor** (full CRUD units → chapters → lessons → activities).
10. **Progress helper** (compute/update on approve).
11. **Mentor slots:** add Google Calendar link for educators (e.g. `calendar_url` on educators, show link on student dashboard).

---

## 10. Notes

- **Auth:** Supabase Auth only for this app; `app_users.id` = `auth.users.id`; resolve role from `app_users.role`.
- **RLS:** Add Supabase RLS policies so students see only their unit and their logs; educators see their unit’s students and logs.
- **Existing Users feature:** The current Users feature may use a different `users` table. Keep it for admin “Users” page if needed; align with `app_users` when consolidating.
- **Educator calendar:** Add `calendar_url` (or similar) to `educators` if the schema allows; otherwise use a single config or link per unit for “mentor slots” (Google Calendar link).
