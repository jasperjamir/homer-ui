import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent } from "@/Shared/components/ui/card";
import { JourneyStepper, getVideoJourneySteps } from "@/Shared/components/JourneyStepper";
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

  const steps = getVideoJourneySteps();
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ideate</h1>
          <p className="text-muted-foreground text-sm mt-1">{steps[0].description}</p>
        </div>
        <JourneyStepper steps={steps} currentStepIndex={0} />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mt-6">
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
    </div>
  );
}
