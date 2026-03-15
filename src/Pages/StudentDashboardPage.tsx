import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, LayoutDashboard } from "lucide-react";
import { Link } from "react-router";
import { useCurrentAppUser } from "@/Shared/contexts";
import { getProgressQueryOptions } from "@/Features/Progress/query-options";
import { getStudentByUserIdQueryOptions } from "@/Features/Students/query-options";
import { getUnitsQueryOptions } from "@/Features/Units/query-options";
import { getEducatorsQueryOptions } from "@/Features/Educators/query-options";
import { ROUTES } from "@/Shared/utils";
import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import { Progress } from "@/Shared/components/ui/progress";

export default function StudentDashboardPage() {
  const { appUser, isLoading: appUserLoading } = useCurrentAppUser();
  const { data: student, isLoading: studentLoading } = useQuery(
    getStudentByUserIdQueryOptions(appUser?.id ?? null),
  );
  const { data: units = [] } = useQuery({
    ...getUnitsQueryOptions(),
    enabled: !!student?.unit_id,
  });
  const { data: educators = [] } = useQuery({
    ...getEducatorsQueryOptions(student?.unit_id ? { unitId: student.unit_id } : undefined),
    enabled: !!student?.unit_id,
  });

  const { data: progress = 0 } = useQuery(
    getProgressQueryOptions(student?.id ?? null, student?.unit_id ?? null),
  );

  const isLoading = appUserLoading || studentLoading;
  const myUnit = student?.unit_id
    ? units.find((u) => u.id === student.unit_id)
    : null;
  const mentorCalendarUrl = educators.find((e) => e.calendar_url)?.calendar_url;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Dashboard</CardTitle>
            <CardDescription>
              Sign in with Supabase to see your pillars and progress.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {appUser.name}
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.LEARNING_MODULES}>
            <BookOpen className="mr-2 h-4 w-4" />
            Learning Modules
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              My progress
            </CardTitle>
            <CardDescription>
              {myUnit
                ? `Your pillar: ${myUnit.name}`
                : "You are not assigned to a unit yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {student != null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            {!student && (
              <p className="text-muted-foreground text-sm">
                No student record found. Contact your educator.
              </p>
            )}
          </CardContent>
        </Card>

        {mentorCalendarUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mentor slots
              </CardTitle>
              <CardDescription>
                Book a slot with your mentor via Google Calendar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <a
                  href={mentorCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open calendar
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
