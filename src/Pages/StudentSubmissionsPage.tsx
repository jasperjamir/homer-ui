import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { ArrowLeft, BookOpen, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { useCurrentAppUser } from "@/Shared/contexts";
import type { StudentLogWithHierarchy } from "@/Features/StudentLogs/services";
import {
  getStudentLogsWithHierarchyQueryOptions,
  useApproveStudentLogMutation,
} from "@/Features/StudentLogs/query-options";
import { getEducatorByUserIdQueryOptions } from "@/Features/Educators/query-options";
import { getStudentWithUserByIdQueryOptions } from "@/Features/Students/query-options";
import { StudentLogStatus } from "@/Shared/models";
import { ROUTES } from "@/Shared/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Shared/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Shared/components/ui/alert-dialog";
import { Badge } from "@/Shared/components/ui/badge";
import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import { toast } from "sonner";

type ChapterGroup = {
  chapterId: string;
  chapterName: string;
  chapterSortOrder: number;
  lessons: {
    lessonId: string;
    lessonName: string;
    lessonSortOrder: number;
    logs: StudentLogWithHierarchy[];
  }[];
};

function groupSubmissionsByHierarchy(
  logs: StudentLogWithHierarchy[],
): { hierarchy: ChapterGroup[]; flatFallback: StudentLogWithHierarchy[] } {
  const flatFallback = logs.filter((log) => !log.chapter_id || !log.lesson_id);
  const withHierarchy = logs.filter(
    (log) => log.chapter_id && log.lesson_id,
  );
  const byChapter = new Map<
    string,
    {
      name: string;
      sortOrder: number;
      lessons: Map<
        string,
        { name: string; sortOrder: number; logs: StudentLogWithHierarchy[] }
      >;
    }
  >();
  for (const log of withHierarchy) {
    let chapter = byChapter.get(log.chapter_id);
    if (!chapter) {
      chapter = {
        name: log.chapter_name,
        sortOrder: log.chapter_sort_order,
        lessons: new Map(),
      };
      byChapter.set(log.chapter_id, chapter);
    }
    let lesson = chapter.lessons.get(log.lesson_id);
    if (!lesson) {
      lesson = {
        name: log.lesson_name,
        sortOrder: log.lesson_sort_order,
        logs: [],
      };
      chapter.lessons.set(log.lesson_id, lesson);
    }
    lesson.logs.push(log);
  }
  for (const chapter of byChapter.values()) {
    for (const lesson of chapter.lessons.values()) {
      lesson.logs.sort(
        (a, b) => a.activity_sort_order - b.activity_sort_order,
      );
    }
  }
  const result: ChapterGroup[] = [];
  byChapter.forEach((chapter, chapterId) => {
    const lessons = Array.from(chapter.lessons.entries())
      .map(([lessonId, lesson]) => ({
        lessonId,
        lessonName: lesson.name,
        lessonSortOrder: lesson.sortOrder,
        logs: lesson.logs,
      }))
      .sort((a, b) => a.lessonSortOrder - b.lessonSortOrder);
    result.push({
      chapterId,
      chapterName: chapter.name,
      chapterSortOrder: chapter.sortOrder,
      lessons,
    });
  });
  result.sort((a, b) => a.chapterSortOrder - b.chapterSortOrder);
  return { hierarchy: result, flatFallback };
}

const STATUS_LABEL: Record<string, string> = {
  [StudentLogStatus.TODO]: "To do",
  [StudentLogStatus.IN_PROGRESS]: "In progress",
  [StudentLogStatus.FOR_APPROVAL]: "For approval",
  [StudentLogStatus.APPROVED]: "Approved",
};

function SubmissionStatusBadge({ status }: { status: string }) {
  const variant =
    status === StudentLogStatus.APPROVED
      ? "default"
      : status === StudentLogStatus.FOR_APPROVAL
        ? "secondary"
        : "outline";
  return (
    <Badge variant={variant}>
      {status === StudentLogStatus.APPROVED && (
        <CheckCircle className="mr-1 h-3 w-3" />
      )}
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export default function StudentSubmissionsPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { appUser, isLoading: appUserLoading } = useCurrentAppUser();
  const { data: educator, isLoading: educatorLoading } = useQuery(
    getEducatorByUserIdQueryOptions(appUser?.id ?? null),
  );

  const { data: student, isLoading: studentLoading } = useQuery(
    getStudentWithUserByIdQueryOptions(studentId ?? null),
  );
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
  } = useQuery(
    getStudentLogsWithHierarchyQueryOptions(studentId ?? null),
  );

  const { hierarchy, flatFallback } = useMemo(
    () => groupSubmissionsByHierarchy(submissions),
    [submissions],
  );
  const useHierarchy = hierarchy.length > 0;

  const [logToApprove, setLogToApprove] = useState<StudentLogWithHierarchy | null>(null);
  const [approvingLogId, setApprovingLogId] = useState<string | null>(null);

  const approveMutation = useApproveStudentLogMutation({
    onSuccess: () => {
      toast.success("Submission approved");
      setLogToApprove(null);
      setApprovingLogId(null);
    },
    onError: (e) => {
      toast.error(e.message ?? "Failed to approve");
      setApprovingLogId(null);
    },
  });

  const handleConfirmApprove = () => {
    if (!logToApprove || !educator?.id) return;
    setApprovingLogId(logToApprove.id);
    approveMutation.mutate({
      logId: logToApprove.id,
      approverId: educator.id,
    });
  };

  const isLoading = appUserLoading || educatorLoading || studentLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!appUser || !educator) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Sign in as an educator to view student submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to={ROUTES.EDUCATOR_DASHBOARD}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!studentId || (!studentLoading && !student)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Student not found</CardTitle>
            <CardDescription>
              This student may not exist or you may not have access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to={ROUTES.EDUCATOR_DASHBOARD}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studentDisplayName =
    student?.name || student?.email || `Student ${studentId.slice(0, 8)}…`;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to={ROUTES.EDUCATOR_DASHBOARD} className="text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
          <h1 className="font-bold text-3xl">{studentDisplayName} – Submissions</h1>
          <p className="text-muted-foreground text-sm">
            Review and approve activity submissions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Activity submissions from this student by chapter and lesson. Approve when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : !useHierarchy && submissions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No submissions yet.
            </p>
          ) : useHierarchy ? (
            <Accordion
              type="multiple"
              defaultValue={hierarchy.map((ch) => ch.chapterId)}
              className="w-full"
            >
              {hierarchy.map((chapter) => (
                <AccordionItem key={chapter.chapterId} value={chapter.chapterId}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {chapter.chapterName}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.lessonId}
                          className="rounded-md border p-3"
                        >
                          <p className="font-medium text-sm">{lesson.lessonName}</p>
                          <ul className="mt-2 space-y-2">
                            {lesson.logs.map((log) => (
                              <li
                                key={log.id}
                                className="flex flex-wrap items-center justify-between gap-2 rounded border bg-muted/30 px-3 py-2 text-sm"
                              >
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium">
                                    {log.activity_name ?? "Activity"}
                                  </span>
                                  {log.submission_details && (
                                    <p className="text-muted-foreground text-xs">
                                      {log.submission_details}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <SubmissionStatusBadge status={log.status} />
                                  {log.submission_link ? (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a
                                        href={log.submission_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Open submission link"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  ) : null}
                                  <Button
                                    size="sm"
                                    variant={
                                      log.status === StudentLogStatus.APPROVED
                                        ? "secondary"
                                        : "default"
                                    }
                                    className="min-w-[5.5rem]"
                                    onClick={() =>
                                      log.status === StudentLogStatus.FOR_APPROVAL &&
                                      educator?.id &&
                                      setLogToApprove(log)
                                    }
                                    disabled={
                                      log.status === StudentLogStatus.APPROVED ||
                                      !!approvingLogId
                                    }
                                  >
                                    {approvingLogId === log.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : log.status === StudentLogStatus.APPROVED ? (
                                      "Approved"
                                    ) : (
                                      "Approve"
                                    )}
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <ul className="space-y-2">
              {(flatFallback.length ? flatFallback : submissions).map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border bg-muted/30 px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">
                      {log.activity_name ?? "Activity"}
                    </span>
                    {log.submission_details && (
                      <p className="text-muted-foreground text-xs">
                        {log.submission_details}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <SubmissionStatusBadge status={log.status} />
                    {log.submission_link ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={log.submission_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open submission link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant={
                        log.status === StudentLogStatus.APPROVED
                          ? "secondary"
                          : "default"
                      }
                      className="min-w-[5.5rem]"
                      onClick={() =>
                        log.status === StudentLogStatus.FOR_APPROVAL &&
                        educator?.id &&
                        setLogToApprove(log)
                      }
                      disabled={
                        log.status === StudentLogStatus.APPROVED ||
                        !!approvingLogId
                      }
                    >
                      {approvingLogId === log.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : log.status === StudentLogStatus.APPROVED ? (
                        "Approved"
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!logToApprove}
        onOpenChange={(open) => !open && setLogToApprove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this submission
              {logToApprove?.activity_name
                ? ` for "${logToApprove.activity_name}"`
                : ""}
              ? This will mark it as approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!approvingLogId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              disabled={!!approvingLogId}
            >
              {approvingLogId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving…
                </>
              ) : (
                "Approve"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
