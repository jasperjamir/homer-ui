import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { Textarea } from "@/Shared/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  getVideoGenerationQueryOptions,
  getVideoGenerationStoryboardQueryOptions,
  useUpdateStoryboardMutation,
} from "@/Features/VideoGenerations/query-options";
import { ROUTES, videoGenerationDetail, videoGenerationStoryboard } from "@/Shared/utils/routes.util";

export default function VideoGenerationStoryboardPage() {
  const { id } = useParams<{ id: string }>();
  const [localContent, setLocalContent] = useState<string>("");

  const { data: generation, isLoading: genLoading } = useQuery(
    getVideoGenerationQueryOptions(id ?? "")
  );
  const { data: storyboard, isLoading: sbLoading } = useQuery(
    getVideoGenerationStoryboardQueryOptions(id ?? "")
  );

  useEffect(() => {
    if (storyboard) setLocalContent(JSON.stringify(storyboard.content, null, 2));
  }, [storyboard?.id]);

  const updateMutation = useUpdateStoryboardMutation(id ?? "", {
    onSuccess: () => {
      toast.success("Storyboard saved");
    },
    onError: (e) => toast.error(e.message),
  });

  const isEditing =
    localContent !== "" &&
    localContent !== JSON.stringify(storyboard?.content ?? {}, null, 2);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(localContent) as Record<string, unknown>;
      updateMutation.mutate(parsed);
    } catch {
      toast.error("Invalid JSON");
    }
  };

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={ROUTES.VIDEO_GENERATIONS}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Storyboard editor</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Storyboard (mock output)</CardTitle>
          <p className="text-muted-foreground text-sm">
            Edit the storyboard JSON. Replace with real storyboard generation later.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sbLoading ? (
            <p className="text-muted-foreground">Loading storyboard...</p>
          ) : (
            <>
              <Textarea
                value={localContent || "{}"}
                onChange={(e) => setLocalContent(e.target.value)}
                rows={16}
                className="font-mono text-sm resize-y"
                placeholder='{"frames": [...]}'
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending || !isEditing}
                >
                  {updateMutation.isPending ? "Saving…" : "Save storyboard"}
                </Button>
                <Button variant="outline" asChild>
                  <Link to={videoGenerationDetail(id)}>Next: Generate video</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
