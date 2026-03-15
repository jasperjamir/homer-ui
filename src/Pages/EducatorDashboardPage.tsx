import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { LayoutDashboard, Users } from "lucide-react";
import { useCurrentAppUser } from "@/Shared/contexts";
import { getEducatorByUserIdQueryOptions } from "@/Features/Educators/query-options";
import { getProgressQueryOptions } from "@/Features/Progress/query-options";
import { getStudentsWithUsersQueryOptions } from "@/Features/Students/query-options";
import { ROUTES, studentSubmissionsPath } from "@/Shared/utils";
import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import { Progress } from "@/Shared/components/ui/progress";

export default function EducatorDashboardPage() {
  const { appUser, isLoading: appUserLoading } = useCurrentAppUser();
  const { data: educator, isLoading: educatorLoading } = useQuery(
    getEducatorByUserIdQueryOptions(appUser?.id ?? null),
  );
  const { data: studentsWithUsers = [] } = useQuery({
    ...getStudentsWithUsersQueryOptions(educator?.unit_id ?? null),
  });

  const progressQueries = useQueries({
    queries: (studentsWithUsers ?? []).map((s) =>
      getProgressQueryOptions(s.id, educator?.unit_id ?? null),
    ),
  });

  const getProgress = (studentId: string) => {
    const idx = studentsWithUsers.findIndex((s) => s.id === studentId);
    return progressQueries[idx]?.data ?? 0;
  };

  const isLoading = appUserLoading || educatorLoading;

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
            <CardTitle>Educator Dashboard</CardTitle>
            <CardDescription>Sign in with Supabase to see your students.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!educator) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Educator Dashboard</CardTitle>
            <CardDescription>
              No educator record found. Contact an admin.
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
          <h1 className="font-bold text-3xl">Educator Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {appUser.name}</p>
        </div>
        <Button asChild>
          <Link to={`${ROUTES.USERS}?tab=students`}>
            <Users className="mr-2 h-4 w-4" />
            View students
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            My students
          </CardTitle>
          <CardDescription>
            {studentsWithUsers.length} student(s) in your unit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentsWithUsers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No students assigned to your unit yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {studentsWithUsers.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <span className="font-medium">
                      {s.name || s.email || `Student ${s.id.slice(0, 8)}…`}
                    </span>
                    {s.email && s.name && (
                      <p className="text-muted-foreground truncate text-sm">
                        {s.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress value={getProgress(s.id)} className="h-2" />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {getProgress(s.id)}%
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={studentSubmissionsPath(s.id)}>
                        View submissions
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
