import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { ImageIcon, Video, Upload, FolderOpen } from "lucide-react";
import { ROUTES } from "@/Shared/utils/routes.util";

export default function HomePage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Config, generate images or videos, then upload assets to platforms.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="h-4 w-4" />
              Config
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.PROJECTS}>Projects</Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.MARKETING_PROMPTS}>Marketing prompts</Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.PLATFORMS}>Platforms</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="h-4 w-4" />
              Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.IMAGE_GENERATIONS_NEW}>Generate image links</Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.IMAGE_GENERATIONS}>View all</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="h-4 w-4" />
              Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.VIDEO_GENERATIONS_NEW}>Generate storyboard</Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.VIDEO_GENERATIONS}>View all</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4" />
              Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link to={ROUTES.UPLOAD}>Choose assets & platforms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
