import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import {
  getVideoGenerationAssetsListQueryOptions,
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
import { JourneyStepper, getVideoJourneySteps } from "@/Shared/components/JourneyStepper";
import { videoGenerationDetail } from "@/Shared/utils/routes.util";

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
  const { data: generationAssetsData } = useQuery(
    getVideoGenerationAssetsListQueryOptions(id ?? "")
  );

  const hasGeneratedVideo = (generationAssetsData?.assets ?? []).some((asset) =>
    Boolean(asset.assetUrl) ||
    Boolean(asset.pollingRequestId) ||
    (asset.status != null && asset.status !== "queued")
  );

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
    if (!id || !storyboard || !localContent || !generation) return;
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
        duration: generation.duration ?? 12,
      });
    } catch {
      // Mutation errors are handled by onError
    }
  };

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Generating...</div>;

  const steps = getVideoJourneySteps();
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Validate</h1>
          <p className="text-muted-foreground text-sm mt-1">Validate and edit your storyboard before generating videos.</p>
        </div>
        <JourneyStepper steps={steps} currentStepIndex={1} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="mb-0">Storyboard</CardTitle>
          </div>
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
      </div>
    </div>
  );
}
