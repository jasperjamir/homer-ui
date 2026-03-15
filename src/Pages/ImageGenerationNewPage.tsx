import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { JourneyStepper, getImageJourneySteps } from "@/Shared/components/JourneyStepper";
import { GenerationForm } from "@/Features/ImageGenerations/components";
import { useCreateImageGenerationMutation } from "@/Features/ImageGenerations/query-options";
import type { GenerationFormData } from "@/Features/ImageGenerations/schemas";
import { imageGenerationDetail } from "@/Shared/utils/routes.util";

export default function ImageGenerationNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateImageGenerationMutation({
    onSuccess: (id) => {
      toast.success("Image generation created");
      navigate(imageGenerationDetail(id));
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
      model: data.model === "NANO BANANA" ? "NANO BANANA" : "GROK",
    });
  };

  const steps = getImageJourneySteps({});
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          <JourneyStepper steps={steps} currentStepIndex={0} />
          <div>
            <CardTitle>IDEATE</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {steps[0].description}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <GenerationForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Generate images"
            showModelField
            modelType="image"
          />
        </CardContent>
      </Card>
    </div>
  );
}
