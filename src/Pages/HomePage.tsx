import { Link } from "react-router";
import { Button } from "@/Shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Shared/components/ui/dropdown-menu";
import { ImageIcon, Video, Upload, Settings2 } from "lucide-react";
import { ROUTES } from "@/Shared/utils/routes.util";

export default function HomePage() {
  return (
    <div className="p-6 space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate assets, then upload to your platforms.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0" title="Edit AI Builder">
              <Settings2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={ROUTES.PLATFORMS}>Platforms</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.MARKETING_PROMPTS}>Marketing Prompts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.PROJECTS}>Project Prompts</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Button
          variant="default"
          size="lg"
          className="h-28 sm:h-32 text-lg font-semibold flex flex-col gap-2"
          asChild
        >
          <Link to={ROUTES.IMAGE_GENERATIONS_NEW}>
            <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12" />
            Generate Images
          </Link>
        </Button>
        <Button
          variant="default"
          size="lg"
          className="h-28 sm:h-32 text-lg font-semibold flex flex-col gap-2"
          asChild
        >
          <Link to={ROUTES.VIDEO_GENERATIONS_NEW}>
            <Video className="h-10 w-10 sm:h-12 sm:w-12" />
            Generate Videos
          </Link>
        </Button>
        <Button
          variant="default"
          size="lg"
          className="h-28 sm:h-32 text-lg font-semibold flex flex-col gap-2"
          asChild
        >
          <Link to={ROUTES.UPLOAD}>
            <Upload className="h-10 w-10 sm:h-12 sm:w-12" />
            Upload Images or Videos
          </Link>
        </Button>
      </div>
    </div>
  );
}
