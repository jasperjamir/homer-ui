"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/Shared/components/ui/dialog";

export interface MediaPreviewSource {
  url: string;
  type: "image" | "video";
}

export interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaPreviewSource | null;
  /** Optional aspect class for image preview container (e.g. "aspect-[4/5]" or "aspect-[9/16]"). Defaults to unconstrained. */
  imageAspectClass?: string;
}

function PreviewUnavailablePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-muted rounded text-muted-foreground ${className ?? ""}`}
      role="img"
      aria-label="Preview unavailable"
    >
      <span className="text-sm font-medium">Preview unavailable</span>
    </div>
  );
}

export function MediaPreviewDialog({
  open,
  onOpenChange,
  media,
  imageAspectClass,
}: MediaPreviewDialogProps) {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoadError(false);
    }
  }, [open]);

  useEffect(() => {
    if (media) {
      setLoadError(false);
    }
  }, [media?.url, media?.type]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setLoadError(false);
    onOpenChange(next);
  };

  const showPlaceholder = !media?.url?.trim() || loadError;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-4xl p-0 overflow-hidden"
        showCloseButton
      >
        {showPlaceholder ? (
          <PreviewUnavailablePlaceholder className="min-h-[300px] w-full" />
        ) : media && media.type === "image" ? (
          <div
            className={
              imageAspectClass
                ? `w-full max-h-[85vh] ${imageAspectClass} flex items-center justify-center`
                : "w-full max-h-[85vh] flex items-center justify-center"
            }
          >
            <img
              src={media.url}
              alt="Preview"
              className={
                imageAspectClass
                  ? "w-full h-full object-contain rounded-lg"
                  : "max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              }
              onError={() => setLoadError(true)}
            />
          </div>
        ) : media ? (
          <div className="w-full max-h-[85vh] aspect-[9/16]">
            <video
              src={media.url}
              controls
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain rounded-lg"
              onError={() => setLoadError(true)}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
