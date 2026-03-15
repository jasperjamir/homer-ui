import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { GenerationForm } from "@/Features/ImageGenerations/components";
import { useCreateVideoGenerationMutation } from "@/Features/VideoGenerations/query-options";
import type { GenerationFormData } from "@/Features/ImageGenerations/schemas";
import { videoGenerationStoryboard } from "@/Shared/utils/routes.util";

export default function VideoGenerationNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateVideoGenerationMutation({
    onSuccess: (id) => {
      toast.success("Storyboard created");
      navigate(videoGenerationStoryboard(id));
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (data: GenerationFormData) => {
    createMutation.mutate({
      marketingPromptId: data.marketingPromptId ?? null,
      projectId: data.projectId ?? null,
      context: data.context,
      platformType: data.platformType ?? null,
      assetCount: data.assetCount,
      model: (data.model === "SORA" ? "SORA" : "GROK"),
      duration: data.duration ?? 12,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1: Create storyboard</CardTitle>
          <p className="text-muted-foreground text-sm">
            Submit to create a storyboard via the API. Edit it in the next step, then generate videos.
          </p>
        </CardHeader>
        <CardContent>
          <GenerationForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create storyboard"
            showModelField
            modelType="video"
            showDurationField
          />
        </CardContent>
      </Card>
    </div>
  );
}
