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
  getVideoGenerationStoryboardWithPollingQueryOptions,
  useGenerateVideoFromStoryboardMutation,
  useUpdateStoryboardMutation,
} from "@/Features/VideoGenerations/query-options";
import { useNavigate } from "react-router";
import { ROUTES, videoGenerationDetail } from "@/Shared/utils/routes.util";

export default function VideoGenerationStoryboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localContent, setLocalContent] = useState<string>("");

  const { data: generation, isLoading: genLoading } = useQuery(
    getVideoGenerationQueryOptions(id ?? "")
  );
  const { data: storyboard, isLoading: sbLoading } = useQuery(
    getVideoGenerationStoryboardWithPollingQueryOptions(id ?? "")
  );

  useEffect(() => {
    if (storyboard) setLocalContent(JSON.stringify(storyboard.content, null, 2));
  }, [storyboard?.id]);

  const updateMutation = useUpdateStoryboardMutation(id ?? "", {
    onError: (e) => toast.error(e.message),
  });

  const generateMutation = useGenerateVideoFromStoryboardMutation({
    onSuccess: () => {
      toast.success("Video generation started");
      navigate(videoGenerationDetail(id ?? ""));
    },
    onError: (e) => toast.error(e.message),
  });

  const isPending = updateMutation.isPending || generateMutation.isPending;

  const handleSaveAndGenerate = async () => {
    try {
      const parsed = JSON.parse(localContent || "{}") as Record<string, unknown>;
      if (!id || !storyboard) return;
      await updateMutation.mutateAsync(parsed);
      generateMutation.mutate({
        videoGenerationStoryboardId: storyboard.id,
        storyboard: parsed,
        videoGenerationId: id,
      });
    } catch (e) {
      if (e instanceof SyntaxError) {
        toast.error("Invalid JSON. Fix the storyboard before generating.");
      }
      // Mutation errors are handled by onError
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
          <CardTitle>Step 2: Storyboard</CardTitle>
          <p className="text-muted-foreground text-sm">
            Edit the storyboard JSON, then click Save storyboard and generate video.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sbLoading || !storyboard ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <span>Generating storyboard...</span>
            </div>
          ) : (
            <>
              <Textarea
                value={localContent || "{}"}
                onChange={(e) => setLocalContent(e.target.value)}
                rows={16}
                className="font-mono text-sm resize-y"
                placeholder='{"frames": [...]}'
              />
              <Button
                onClick={handleSaveAndGenerate}
                disabled={isPending}
              >
                {isPending ? "Saving & generating…" : "Save storyboard and generate video"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
