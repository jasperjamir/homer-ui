import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, CheckCircle, ExternalLink, Loader2, Send } from "lucide-react";
import { useCurrentAppUser } from "@/Shared/contexts";
import { getStudentByUserIdQueryOptions } from "@/Features/Students/query-options";
import { getUnitsQueryOptions } from "@/Features/Units/query-options";
import { getChaptersQueryOptions } from "@/Features/Chapters/query-options";
import { getLessonsQueryOptions } from "@/Features/Lessons/query-options";
import { getActivitiesQueryOptions } from "@/Features/Activities/query-options";
import {
  getStudentLogByStudentAndActivityQueryOptions,
  useSubmitStudentLogMutation,
} from "@/Features/StudentLogs/query-options";
import { StudentLogStatus } from "@/Shared/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Shared/components/ui/accordion";
import { Badge } from "@/Shared/components/ui/badge";
import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Shared/components/ui/dialog";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import { Textarea } from "@/Shared/components/ui/textarea";

export default function LearningModulesPage() {
  const { appUser } = useCurrentAppUser();
  const { data: student } = useQuery(
    getStudentByUserIdQueryOptions(appUser?.id ?? null),
  );
  const { data: units = [] } = useQuery(getUnitsQueryOptions());
  const unitId = student?.unit_id ?? null;
  const { data: chapters = [] } = useQuery({
    ...getChaptersQueryOptions(unitId ?? ""),
    enabled: !!unitId,
  });

  const [submitActivity, setSubmitActivity] = useState<{
    activityId: string;
    activityName: string;
  } | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionDetails, setSubmissionDetails] = useState("");

  const submitMutation = useSubmitStudentLogMutation({
    onSuccess: () => {
      toast.success("Submission saved.");
      setSubmitActivity(null);
      setSubmissionLink("");
      setSubmissionDetails("");
    },
    onError: (e) => toast.error(e.message ?? "Failed to submit"),
  });

  const handleOpenSubmit = (payload: {
    activityId: string;
    activityName: string;
  }) => {
    setSubmitActivity({
      activityId: payload.activityId,
      activityName: payload.activityName,
    });
  };

  const handleSubmit = () => {
    if (!student || !submitActivity) return;
    if (!submissionLink.trim()) {
      toast.error("Please enter the link to your copy.");
      return;
    }
    submitMutation.mutate({
      studentId: student.id,
      activityId: submitActivity.activityId,
      payload: {
        submission_link: submissionLink.trim(),
        submission_details: submissionDetails.trim() || undefined,
      },
    });
  };

  if (!appUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Modules</CardTitle>
            <CardDescription>Sign in with Supabase to view modules.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!student?.unit_id) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Modules</CardTitle>
            <CardDescription>
              You are not assigned to a unit yet. Contact your educator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const unit = units.find((u) => u.id === unitId);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">Learning Modules</h1>
        <p className="text-muted-foreground">
          {unit ? `Pillar: ${unit.name}` : "Loading..."}
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            studentId={student.id}
            onOpenSubmit={handleOpenSubmit}
          />
        ))}
      </Accordion>

      {chapters.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No chapters in this pillar yet.
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!submitActivity}
        onOpenChange={(open) => !open && setSubmitActivity(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Submit: {submitActivity?.activityName ?? ""}
            </DialogTitle>
            <DialogDescription>
              Add the link to your copy (e.g. Google Doc/Sheet) and optional details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="submission_link">Link to your copy *</Label>
              <Input
                id="submission_link"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="submission_details">Details (optional)</Label>
              <Textarea
                id="submission_details"
                value={submissionDetails}
                onChange={(e) => setSubmissionDetails(e.target.value)}
                placeholder="Any notes for your educator..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSubmitActivity(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !submissionLink.trim()}
              >
                {submitMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChapterSection({
  chapter,
  studentId,
  onOpenSubmit,
}: {
  chapter: { id: string; name: string; description: string | null };
  studentId: string;
  onOpenSubmit: (payload: { activityId: string; activityName: string }) => void;
}) {
  const { data: lessons = [] } = useQuery(
    getLessonsQueryOptions(chapter.id),
  );

  return (
    <AccordionItem value={chapter.id}>
      <AccordionTrigger>
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {chapter.name}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {chapter.description && (
          <p className="text-muted-foreground mb-4 text-sm">
            {chapter.description}
          </p>
        )}
        <div className="space-y-2 pl-4">
          {lessons.map((lesson) => (
            <LessonSection
              key={lesson.id}
              lesson={lesson}
              studentId={studentId}
              onOpenSubmit={onOpenSubmit}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function LessonSection({
  lesson,
  studentId,
  onOpenSubmit,
}: {
  lesson: { id: string; name: string; description: string | null };
  studentId: string;
  onOpenSubmit: (payload: { activityId: string; activityName: string }) => void;
}) {
  const { data: activities = [] } = useQuery(
    getActivitiesQueryOptions(lesson.id),
  );

  return (
    <div className="rounded-md border p-3">
      <p className="font-medium text-sm">{lesson.name}</p>
      {lesson.description && (
        <p className="text-muted-foreground mb-2 text-xs">
          {lesson.description}
        </p>
      )}
      <ul className="mt-2 space-y-2">
        {activities.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            studentId={studentId}
            onOpenSubmit={onOpenSubmit}
          />
        ))}
      </ul>
    </div>
  );
}

function ActivityRow({
  activity,
  studentId,
  onOpenSubmit,
}: {
  activity: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
  };
  studentId: string;
  onOpenSubmit: (payload: { activityId: string; activityName: string }) => void;
}) {
  const { data: log } = useQuery(
    getStudentLogByStudentAndActivityQueryOptions(studentId, activity.id),
  );
  const status = log?.status ?? StudentLogStatus.TODO;

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded border bg-muted/30 px-3 py-2 text-sm">
      <div className="min-w-0 flex-1">
        <span className="font-medium">{activity.name}</span>
        {activity.description && (
          <p className="text-muted-foreground text-xs">{activity.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {activity.url && (
          <Button variant="ghost" size="sm" asChild>
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        <StatusBadge status={status} />
        {status !== StudentLogStatus.APPROVED && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onOpenSubmit({ activityId: activity.id, activityName: activity.name })
            }
          >
            {status === StudentLogStatus.TODO || status === StudentLogStatus.IN_PROGRESS
              ? "Submit"
              : "Update"} link
          </Button>
        )}
      </div>
    </li>
  );
}

const STATUS_LABEL: Record<string, string> = {
  [StudentLogStatus.TODO]: "To do",
  [StudentLogStatus.IN_PROGRESS]: "In progress",
  [StudentLogStatus.FOR_APPROVAL]: "For approval",
  [StudentLogStatus.APPROVED]: "Approved",
};

function StatusBadge({ status }: { status: string }) {
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