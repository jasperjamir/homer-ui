import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { ArrowRight, ImageIcon, Video, Upload, Settings2 } from "lucide-react";
import { ROUTES } from "@/Shared/utils/routes.util";

export default function HomePage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground text-sm">
          Generate assets, then upload. Or edit your AI builder config.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              Generate → Upload
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Create image or video assets, then upload them to platforms.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.VIDEO_GENERATIONS_NEW}>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.IMAGE_GENERATIONS_NEW}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Image
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.UPLOAD}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Assets
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4" />
              Edit AI Builder
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Configure platforms, marketing prompts, and project prompts.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.PLATFORMS}>Platforms</Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.MARKETING_PROMPTS}>Marketing Prompts</Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.PROJECTS}>Project Prompts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
