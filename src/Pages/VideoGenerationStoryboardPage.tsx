import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  getVideoGenerationAssetsQueryOptions,
  getVideoGenerationQueryOptions,
  getVideoGenerationStoryboardWithPollingQueryOptions,
  useGenerateVideoFromStoryboardMutation,
  useUpdateStoryboardMutation,
} from "@/Features/VideoGenerations/query-options";
import { StoryboardEditor } from "@/Features/VideoGenerations/components/StoryboardEditor";
import {
  parseStoryboardContent,
  storyboardContentToRecord,
} from "@/Features/VideoGenerations/models";
import { useNavigate } from "react-router";
import { ROUTES, videoGenerationDetail } from "@/Shared/utils/routes.util";

export default function VideoGenerationStoryboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localContent, setLocalContent] = useState<ReturnType<typeof parseStoryboardContent> | null>(null);

  const { data: generation, isLoading: genLoading } = useQuery(
    getVideoGenerationQueryOptions(id ?? "")
  );
  const { data: storyboard, isLoading: sbLoading } = useQuery(
    getVideoGenerationStoryboardWithPollingQueryOptions(id ?? "")
  );
  const { data: assets } = useQuery(
    getVideoGenerationAssetsQueryOptions(id ?? "")
  );

  const hasGeneratedVideo = (assets?.length ?? 0) > 0;

  useEffect(() => {
    if (storyboard) setLocalContent(parseStoryboardContent(storyboard.content));
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
  const hasEmptyFrames =
    localContent != null &&
    localContent.frames.length > 0 &&
    localContent.frames.some((f) => !f.scene.trim() || !f.description.trim());

  const handleSaveAndGenerate = async () => {
    if (!id || !storyboard || !localContent) return;
    if (localContent.frames.length === 0) {
      toast.error("Add at least one frame before generating.");
      return;
    }
    if (hasEmptyFrames) {
      toast.error("Fill in Summary and Visual description for all frames before generating.");
      return;
    }
    try {
      const record = storyboardContentToRecord(localContent);
      await updateMutation.mutateAsync(record);
      generateMutation.mutate({
        videoGenerationStoryboardId: storyboard.id,
        storyboard: record,
        videoGenerationId: id,
      });
    } catch {
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
            {hasGeneratedVideo
              ? "Video has been generated from this storyboard. The storyboard is read-only."
              : "Edit each frame below, then click Save storyboard and generate video."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sbLoading || !storyboard ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <span>Generating storyboard...</span>
            </div>
          ) : localContent ? (
            <>
              <StoryboardEditor
                content={localContent}
                onChange={setLocalContent}
                disabled={hasGeneratedVideo}
              />
              {!hasGeneratedVideo && (
                <Button
                  onClick={handleSaveAndGenerate}
                  disabled={isPending || hasEmptyFrames}
                >
                  {isPending ? "Saving & generating…" : "Save storyboard and generate video"}
                </Button>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
