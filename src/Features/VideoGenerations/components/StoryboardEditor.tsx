import { useRef, useEffect, useState } from "react";
import { Button } from "@/Shared/components/ui/button";
import { Label } from "@/Shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { Textarea } from "@/Shared/components/ui/textarea";
import { cn } from "@/Shared/utils/styles";
import { Plus, Timer, Trash2 } from "lucide-react";
import type { StoryboardContent, StoryboardFrame } from "../models";

const DURATION_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

function AutoResizeTextarea({
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40 resize-none overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

interface StoryboardEditorProps {
  content: StoryboardContent;
  onChange: (content: StoryboardContent) => void;
  disabled?: boolean;
}

export function StoryboardEditor({ content, onChange, disabled }: StoryboardEditorProps) {
  const lastFrameRef = useRef<HTMLButtonElement | null>(null);
  const prevLengthRef = useRef(content.frames.length);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    content.frames.length > 0 ? 0 : null
  );

  const totalDuration = content.frames.reduce((sum, f) => sum + f.duration, 0);

  const updateFrame = (index: number, frame: StoryboardFrame) => {
    const frames = [...content.frames];
    frames[index] = frame;
    onChange({ frames });
  };

  const removeFrame = (index: number) => {
    const frames = content.frames.filter((_, i) => i !== index);
    onChange({ frames });
    setSelectedIndex((prev) => {
      if (prev == null) return null;
      if (prev === index) return frames.length > 0 ? Math.min(prev, frames.length - 1) : null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const addFrame = () => {
    const newIndex = content.frames.length;
    onChange({
      frames: [
        ...content.frames,
        { scene: "", duration: 2, description: "" },
      ],
    });
    setSelectedIndex(newIndex);
  };

  useEffect(() => {
    if (content.frames.length > prevLengthRef.current) {
      prevLengthRef.current = content.frames.length;
      requestAnimationFrame(() => {
        lastFrameRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const lastIndex = content.frames.length - 1;
        const input = document.getElementById(`scene-${lastIndex}`) as HTMLTextAreaElement | null;
        input?.focus();
      });
    } else {
      prevLengthRef.current = content.frames.length;
    }
  }, [content.frames.length]);

  useEffect(() => {
    if (content.frames.length === 0) setSelectedIndex(null);
    else if (selectedIndex != null && selectedIndex >= content.frames.length) {
      setSelectedIndex(content.frames.length - 1);
    }
  }, [content.frames.length, selectedIndex]);

  const selectedFrame = selectedIndex != null ? content.frames[selectedIndex] : null;

  return (
    <div className="space-y-4">
      {/* Frames strip - video aspect ratio, seconds per frame + add frame */}
      {(content.frames.length > 0 || !disabled) && (
        <div className="overflow-x-auto p-3">
          <div className="flex gap-3">
            {content.frames.map((frame, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  ref={index === content.frames.length - 1 ? lastFrameRef : undefined}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "group relative flex shrink-0 flex-col rounded-md transition-all cursor-pointer",
                    "aspect-[9/16] min-w-[5rem] w-24",
                    "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background bg-zinc-200 dark:bg-zinc-800 shadow-md"
                      : "bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  )}
                >
                  {/* Duration - centered */}
                  <div className="relative flex flex-1 flex-col items-center justify-center px-1">
                    <span className="text-xl font-semibold tabular-nums text-zinc-600 dark:text-zinc-400">
                      {frame.duration}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                      sec
                    </span>
                  </div>
                  {/* Summary - bottom, truncated - inset to avoid overlapping ring */}
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 truncate rounded bg-black/40 px-1.5 py-1 text-[10px] text-white/90">
                    {frame.scene.trim() || "No summary"}
                  </div>
                  {/* Frame number - top left */}
                  <div className="absolute left-1 top-1 rounded bg-black/20 dark:bg-white/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-zinc-600 dark:text-zinc-400">
                    {index + 1}
                  </div>
                  {/* Orange ! when no input */}
                  {(!frame.scene.trim() || !frame.description.trim()) && (
                    <div className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      !
                    </div>
                  )}
                </button>
              );
            })}
            {!disabled && (
              <button
                type="button"
                onClick={addFrame}
                className="flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-md aspect-[9/16] min-w-[5rem] w-24 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-500 transition-all cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="size-8" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress bar - timeline showing each frame's portion */}
      {content.frames.length > 0 && totalDuration > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex h-2 w-full overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800">
            {content.frames.map((frame, index) => {
              const widthPercent = (frame.duration / totalDuration) * 100;
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "h-full min-w-[2px] transition-colors",
                    isSelected ? "bg-primary" : "bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-500"
                  )}
                  style={{ width: `${widthPercent}%` }}
                  title={`Frame ${index + 1}: ${frame.duration}s`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] tabular-nums text-zinc-500 dark:text-zinc-500">
            <span>0:00</span>
            <span>
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {/* Frame count & selected frame detail */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {content.frames.length} frame{content.frames.length !== 1 ? "s" : ""}
          {totalDuration > 0 && (
            <span className="ml-2 tabular-nums text-zinc-500 dark:text-zinc-500">
              · {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, "0")}
            </span>
          )}
        </p>
      </div>

      {content.frames.length > 0 ? (
        selectedFrame != null && selectedIndex != null ? (
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">
                Frame {selectedIndex + 1}
              </h3>
              <div className="flex items-center gap-2">
                <Select
                  value={String(
                    DURATION_OPTIONS.includes(selectedFrame.duration)
                      ? selectedFrame.duration
                      : DURATION_OPTIONS.find((s) => s >= selectedFrame.duration) ??
                        DURATION_OPTIONS[DURATION_OPTIONS.length - 1]
                  )}
                  onValueChange={(v) =>
                    updateFrame(selectedIndex, { ...selectedFrame, duration: Number(v) })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger
                    size="sm"
                    className="h-8 min-w-[4.5rem] gap-1.5 rounded-md bg-muted px-3 font-medium tabular-nums"
                  >
                    <Timer className="size-3.5 shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="min-w-[6rem]">
                    {DURATION_OPTIONS.map((sec) => (
                      <SelectItem key={sec} value={String(sec)} className="tabular-nums">
                        {sec} sec
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFrame(selectedIndex)}
                    disabled={content.frames.length <= 1}
                    aria-label="Remove frame"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`scene-${selectedIndex}`}>Summary</Label>
                <AutoResizeTextarea
                  id={`scene-${selectedIndex}`}
                  value={selectedFrame.scene}
                  onChange={(value) =>
                    updateFrame(selectedIndex, { ...selectedFrame, scene: value })
                  }
                  placeholder="e.g. A young student looking tired with a laptop in the background"
                  className={cn(
                    "font-medium min-h-[2.25rem]",
                    disabled && "cursor-default bg-muted/30"
                  )}
                  readOnly={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${selectedIndex}`}>Visual description</Label>
                <Textarea
                  id={`description-${selectedIndex}`}
                  value={selectedFrame.description}
                  onChange={(e) =>
                    updateFrame(selectedIndex, {
                      ...selectedFrame,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed description of the visual, layout, colors, text..."
                  rows={4}
                  className={cn(
                    "resize-y text-sm",
                    disabled && "cursor-default bg-muted/30"
                  )}
                  readOnly={disabled}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Click a frame on the timeline to edit its content.
          </p>
        )
        ) : (
          <p className="rounded-lg bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            {disabled ? "No frames." : "Click the + frame above to add your first frame."}
          </p>
        )}
    </div>
  );
}
