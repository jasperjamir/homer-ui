import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1: Generate images</CardTitle>
          <p className="text-muted-foreground text-sm">
            Submit to create an image generation via the API.
          </p>
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
