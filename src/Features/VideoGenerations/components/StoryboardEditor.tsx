import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import { Textarea } from "@/Shared/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Shared/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import type { StoryboardContent, StoryboardFrame } from "../models";

interface StoryboardEditorProps {
  content: StoryboardContent;
  onChange: (content: StoryboardContent) => void;
}

function FrameCard({
  frame,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  frame: StoryboardFrame;
  index: number;
  onChange: (frame: StoryboardFrame) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <AccordionItem value={`frame-${index}`} className="border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center justify-between gap-4 w-full pr-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {index + 1}
            </span>
            <span className="truncate text-sm font-medium text-left">
              {frame.scene || "Untitled scene"}
            </span>
            <span className="text-muted-foreground text-xs shrink-0">
              {frame.duration}s
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={!canRemove}
            aria-label="Remove frame"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`scene-${index}`}>Scene (short summary)</Label>
            <Input
              id={`scene-${index}`}
              value={frame.scene}
              onChange={(e) => onChange({ ...frame, scene: e.target.value })}
              placeholder="e.g. A young student looking tired with a laptop in the background"
              className="font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`duration-${index}`}>Duration (seconds)</Label>
            <Input
              id={`duration-${index}`}
              type="number"
              min={1}
              max={30}
              value={frame.duration}
              onChange={(e) =>
                onChange({
                  ...frame,
                  duration: Math.max(1, Math.min(30, Number(e.target.value) || 1)),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`description-${index}`}>Visual description</Label>
            <Textarea
              id={`description-${index}`}
              value={frame.description}
              onChange={(e) => onChange({ ...frame, description: e.target.value })}
              placeholder="Detailed description of the visual, layout, colors, text..."
              rows={4}
              className="resize-y text-sm"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function StoryboardEditor({ content, onChange }: StoryboardEditorProps) {
  const updateFrame = (index: number, frame: StoryboardFrame) => {
    const frames = [...content.frames];
    frames[index] = frame;
    onChange({ frames });
  };

  const removeFrame = (index: number) => {
    const frames = content.frames.filter((_, i) => i !== index);
    onChange({ frames });
  };

  const addFrame = () => {
    onChange({
      frames: [
        ...content.frames,
        { scene: "", duration: 2, description: "" },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {content.frames.length} frame{content.frames.length !== 1 ? "s" : ""}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addFrame}>
          <Plus className="h-4 w-4 mr-2" />
          Add frame
        </Button>
      </div>
      {content.frames.length > 0 ? (
        <Accordion type="multiple" defaultValue={content.frames.map((_, i) => `frame-${i}`)} className="space-y-0">
          {content.frames.map((frame, index) => (
            <FrameCard
              key={index}
              frame={frame}
              index={index}
              onChange={(f) => updateFrame(index, f)}
              onRemove={() => removeFrame(index)}
              canRemove={content.frames.length > 1}
            />
          ))}
        </Accordion>
      ) : (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
          <p className="text-sm mb-4">No frames yet. Add your first frame to get started.</p>
          <Button type="button" variant="outline" onClick={addFrame}>
            <Plus className="h-4 w-4 mr-2" />
            Add frame
          </Button>
        </div>
      )}
    </div>
  );
}
