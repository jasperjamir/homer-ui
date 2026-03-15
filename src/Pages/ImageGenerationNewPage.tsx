import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { GenerationForm } from "@/Features/ImageGenerations/components";
import { useCreateImageGenerationMutation } from "@/Features/ImageGenerations/query-options";
import type { GenerationFormData } from "@/Features/ImageGenerations/schemas";
import { ROUTES, imageGenerationDetail } from "@/Shared/utils/routes.util";

export default function ImageGenerationNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateImageGenerationMutation({
    onSuccess: (id) => {
      toast.success("Image links generated (mock)");
      navigate(imageGenerationDetail(id));
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (data: GenerationFormData) => {
    createMutation.mutate({
      context: data.context,
      project_id: data.project_id ?? null,
      marketing_prompt_id: data.marketing_prompt_id ?? null,
      platform_type_id: data.platform_type_id ?? null,
      asset_count: data.asset_count,
    });
  };

  return (
    <div className="p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Generate image links</CardTitle>
          <p className="text-muted-foreground text-sm">
            Submit to create a generation with mock image URLs. Replace with real API later.
          </p>
        </CardHeader>
        <CardContent>
          <GenerationForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Generate image links"
          />
        </CardContent>
      </Card>
    </div>
  );
}
