import { File as FileIcon, Trash2, UploadCloud } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { type DropzoneOptions, type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/Shared/components/ui/button";
import { cn } from "@/Shared/utils/styles";

interface DropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  className?: string;
  value?: File | string | null;
  onDrop?: (file: File | null) => void;
  width?: number;
  height?: number;
  checkAspectRatio?: number; // e.g. 1 for square, 16/9 for widescreen
  maxSize?: number;
  label?: string;
}

export function Dropzone({
  className,
  value,
  onDrop,
  width,
  height,
  checkAspectRatio,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = "Drop files here or click to upload",
  accept = {
    "image/*": [],
  },
  ...props
}: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(
    value instanceof File ? URL.createObjectURL(value) : typeof value === "string" ? value : null,
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const { errors } = fileRejections[0];
        toast.error(errors[0].message);
        return;
      }

      const file = acceptedFiles[0];

      if (!file) return;

      if (width || height || checkAspectRatio) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (width && img.width !== width) {
            toast.error(`Image width must be ${width}px`);
            return;
          }
          if (height && img.height !== height) {
            toast.error(`Image height must be ${height}px`);
            return;
          }
          if (checkAspectRatio) {
            const ratio = img.width / img.height;
            if (Math.abs(ratio - checkAspectRatio) > 0.01) {
              toast.error(`Image must have an aspect ratio of ${checkAspectRatio}:1`);
              return;
            }
          }
          setPreview(img.src);
          onDrop?.(file);
        };
        return;
      }

      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }

      onDrop?.(file);
    },
    [width, height, checkAspectRatio, onDrop],
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onDrop?.(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles: 1,
    ...props,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50",
        isDragActive ? "border-primary bg-muted/50" : "border-muted-foreground/25",
        preview ? "border-solid p-0" : "p-10",
        className,
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
          <img src={preview} alt="Preview" className="h-full w-full object-contain" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : value instanceof File ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <FileIcon className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium text-muted-foreground text-sm">{value.name}</p>
          <p className="text-muted-foreground text-xs">
            {(value.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-muted p-4">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">{isDragActive ? "Drop the file here" : label}</p>
            <p className="text-muted-foreground text-xs">
              Supported formats:{" "}
              {Object.keys(accept || {})
                .join(", ")
                .replace(/image\//g, "")}
            </p>
            {maxSize && (
              <p className="text-muted-foreground text-xs">
                Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
