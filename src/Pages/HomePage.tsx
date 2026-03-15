import { Link } from "react-router";
import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/Shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Shared/components/ui/dropdown-menu";
import { ImageIcon, Video, Settings2, ChevronRight } from "lucide-react";
import { ROUTES } from "@/Shared/utils/routes.util";

const PROCESS_STEPS = [
  {
    label: "Ideate",
    number: "1",
    description: "Provide the AI with the context it needs to create strong content.",
  },
  {
    label: "Validate",
    number: "2",
    description: "Review the AI output before publishing. Ensure the message is clear and matches your brand.",
  },
  {
    label: "Launch",
    number: "3",
    description: "Publish it to your chosen platform.",
  },
] as const;

const GENERATE_OPTIONS = [
  {
    to: ROUTES.VIDEO_GENERATIONS_NEW,
    title: "Generate Video",
    description: "Create video storyboards and generate clips. Build frames, set duration, and export.",
    icon: Video,
  },
  {
    to: ROUTES.IMAGE_GENERATIONS_NEW,
    title: "Generate Image",
    description: "Create new images with the prompt builder. Pick a project and marketing prompt, then generate.",
    icon: ImageIcon,
  },
] as const;

export default function HomePage() {
  return (
    <div className="p-6 space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Choose to generate images or videos.
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

      <div className="grid gap-6 sm:grid-cols-2">
        {GENERATE_OPTIONS.map(({ to, title, description, icon: Icon }) => (
          <Link key={to} to={to} className="block group">
            <Card className="h-full cursor-pointer border-2 border-primary/20 transition-all hover:shadow-lg hover:border-primary/50 hover:bg-accent/50 active:scale-[0.99] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
                  </div>
                  <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-primary transition-all" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mt-2 group-hover:text-primary transition-colors">
                  {title}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-muted/20 cursor-default">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Generate assets using the three-step process</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Ideate → Validate → Launch. Create images or videos above to begin.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-sm font-semibold text-primary">
                  {step.number}
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
