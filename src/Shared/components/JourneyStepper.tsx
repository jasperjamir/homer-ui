import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

export interface JourneyStep {
  /** Label inside the circle, e.g. "1", "2.1", "2.2", "3" */
  circleLabel: string;
  /** Short label shown under circle, e.g. "Ideate", "Validate", "Launch" */
  shortLabel: string;
  /** Full step description (for page content) */
  description: string;
  /** Optional extra context (e.g. for Validate steps, shown separately) */
  context?: string;
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
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                i === currentStepIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background text-muted-foreground"
              }`}
              aria-current={i === currentStepIndex ? "step" : undefined}
              aria-label={step.shortLabel}
            >
              {step.circleLabel}
            </div>
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
  "Publish it to your chosen platform.";

/** Image journey: (1) Ideate → (2) Validate → (3) Launch */
export function getImageJourneySteps(): JourneyStep[] {
  return [
    {
      circleLabel: "1",
      shortLabel: "Ideate",
      description: IDEATE_DESCRIPTION,
    },
    {
      circleLabel: "2",
      shortLabel: "Validate",
      description: "",
      context: "",
    },
    {
      circleLabel: "3",
      shortLabel: "Launch",
      description: LAUNCH_DESCRIPTION,
    },
  ];
}

/** Video journey: (1) Ideate → (2.1) Validate → (2.2) Validate → (3) Launch */
export function getVideoJourneySteps(): JourneyStep[] {
  return [
    {
      circleLabel: "1",
      shortLabel: "Ideate",
      description: IDEATE_DESCRIPTION,
    },
    {
      circleLabel: "2.1",
      shortLabel: "Validate",
      description: "",
      context: VALIDATE_CONTEXT,
    },
    {
      circleLabel: "2.2",
      shortLabel: "Validate",
      description: "",
      context: VALIDATE_CONTEXT,
    },
    {
      circleLabel: "3",
      shortLabel: "Launch",
      description: LAUNCH_DESCRIPTION,
    },
  ];
}
