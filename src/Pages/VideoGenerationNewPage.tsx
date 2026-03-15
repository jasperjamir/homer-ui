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
      toast.success("Storyboard created (mock)");
      navigate(videoGenerationStoryboard(id));
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (data: GenerationFormData) => {
    createMutation.mutate({
      context: data.context,
      project_id: data.project_id ?? null,
      marketing_prompt_id: data.marketing_prompt_id ?? null,
      platform_type: data.platform_type ?? null,
      asset_count: data.asset_count,
    });
  };

  return (
    <div className="p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Generate storyboard</CardTitle>
          <p className="text-muted-foreground text-sm">
            Submit to create a video generation with a mock storyboard. Edit it in the next step, then generate video links.
          </p>
        </CardHeader>
        <CardContent>
          <GenerationForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Create storyboard"
          />
        </CardContent>
      </Card>
    </div>
  );
}
