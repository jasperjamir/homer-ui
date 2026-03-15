import { Fragment } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import {
  ROUTES,
  imageGenerationDetail,
  uploadWithGenerationId,
  uploadWithVideoGenerationId,
  videoGenerationDetail,
  videoGenerationStoryboard,
} from "@/Shared/utils/routes.util";

export interface JourneyStep {
  /** Label inside the circle, e.g. "1", "2.1", "2.2", "3" */
  circleLabel: string;
  /** Short label shown under circle, e.g. "IDEATE", "VALIDATE", "LAUNCH" */
  shortLabel: string;
  /** Full step description (for page content) */
  description: string;
  /** Optional extra context (e.g. for VALIDATE steps, shown separately) */
  context?: string;
  /** When set, the step is clickable and navigates here */
  href?: string;
}

interface JourneyStepperProps {
  steps: JourneyStep[];
  /** 0-based index of the current step (where "I'm here" is shown) */
  currentStepIndex: number;
  className?: string;
}

export function JourneyStepper({ steps, currentStepIndex, className = "" }: JourneyStepperProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} role="list" aria-label="Journey steps">
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            {step.href && i !== currentStepIndex ? (
              <Link
                to={step.href}
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors hover:border-primary/80 hover:bg-primary/10 hover:text-primary ${
                  i === currentStepIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                }`}
                aria-label={`Go to step: ${step.shortLabel} - ${step.circleLabel}`}
              >
                {step.circleLabel}
              </Link>
            ) : (
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  i === currentStepIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                }`}
                aria-current={i === currentStepIndex ? "step" : undefined}
                aria-label={step.shortLabel}
              >
                {step.circleLabel}
              </div>
            )}
            {i < steps.length - 1 && (
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => (
          <Fragment key={i}>
            <div className="flex size-10 shrink-0 flex-col items-center justify-center gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {step.shortLabel}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex size-5 shrink-0" aria-hidden />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const IDEATE_DESCRIPTION =
  "Provide the AI with the context it needs to create strong content.";

const VALIDATE_CONTEXT =
  "Ensure the message is clear, the visual is easy to understand, and the content matches your brand.";

const LAUNCH_DESCRIPTION =
  "Publish it to your chosen platform. 🚀";

/** Image journey: (1) IDEATE → (2.1) VALIDATE → (3) LAUNCH */
export function getImageJourneySteps(context: {
  imageGenerationId?: string | null;
}): JourneyStep[] {
  const { imageGenerationId } = context;
  return [
    {
      circleLabel: "1",
      shortLabel: "IDEATE",
      description: IDEATE_DESCRIPTION,
      href: ROUTES.IMAGE_GENERATIONS_NEW,
    },
    {
      circleLabel: "2.1",
      shortLabel: "VALIDATE",
      description: "",
      context: VALIDATE_CONTEXT,
      href: imageGenerationId ? imageGenerationDetail(imageGenerationId) : ROUTES.IMAGE_GENERATIONS,
    },
    {
      circleLabel: "3",
      shortLabel: "LAUNCH",
      description: LAUNCH_DESCRIPTION,
      href: imageGenerationId ? uploadWithGenerationId(imageGenerationId) : ROUTES.UPLOAD,
    },
  ];
}

/** Video journey: (1) IDEATE → (2.1) VALIDATE → (2.2) VALIDATE → (3) LAUNCH */
export function getVideoJourneySteps(context: {
  videoGenerationId?: string | null;
}): JourneyStep[] {
  const { videoGenerationId } = context;
  return [
    {
      circleLabel: "1",
      shortLabel: "IDEATE",
      description: IDEATE_DESCRIPTION,
      href: ROUTES.VIDEO_GENERATIONS_NEW,
    },
    {
      circleLabel: "2.1",
      shortLabel: "VALIDATE",
      description: "",
      context: VALIDATE_CONTEXT,
      href: videoGenerationId ? videoGenerationStoryboard(videoGenerationId) : ROUTES.VIDEO_GENERATIONS,
    },
    {
      circleLabel: "2.2",
      shortLabel: "VALIDATE",
      description: "",
      context: VALIDATE_CONTEXT,
      href: videoGenerationId ? videoGenerationDetail(videoGenerationId) : ROUTES.VIDEO_GENERATIONS,
    },
    {
      circleLabel: "3",
      shortLabel: "LAUNCH",
      description: LAUNCH_DESCRIPTION,
      href: videoGenerationId ? uploadWithVideoGenerationId(videoGenerationId) : ROUTES.UPLOAD,
    },
  ];
}
