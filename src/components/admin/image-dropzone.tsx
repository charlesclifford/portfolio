"use client";

import { useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { getImagePreview } from "@/lib/api/projects.api";

interface Props {
  /** Appwrite file $id of the current image — URL is derived internally */
  imageId?: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  uploading?: boolean;
}

export default function ImageDropzone({
  imageId,
  onUpload,
  onRemove,
  uploading,
}: Props) {
  /** Blob URL created from the dropped file before the upload completes */
  const [preview, setPreview] = useState<string | null>(null);
  const [dragError, setDragError] = useState("");

  // Derive the display URL: prefer the confirmed Appwrite URL, fall back to
  // the local blob preview while the upload is still in-flight.
  const remoteUrl = imageId ? getImagePreview(imageId) : null;
  const displayUrl = remoteUrl ?? preview;

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      _event: DropEvent,
    ) => {
      setDragError("");

      if (fileRejections.length > 0) {
        setDragError(fileRejections[0]?.errors[0]?.message ?? "Invalid file.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreview(url);

      try {
        await onUpload(file);
      } catch (error) {
        URL.revokeObjectURL(url);
        setPreview(null);
        setDragError("Upload failed. Please try again.");
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onRemove) await onRemove();
  };

  return (
    <div>
      <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
        Project Image
      </label>

      <AnimatePresence mode="wait">
        {displayUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden border border-border aspect-video group"
          >
            <Image
              src={displayUrl}
              alt="Project preview"
              fill
              className="object-cover"
              unoptimized
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              {/* Replace */}
              <div {...getRootProps({ onClick: (e) => e.stopPropagation() })}>
                <input {...getInputProps()} />
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Upload size={13} />
                  )}
                  Replace
                </button>
              </div>

              {/* Remove */}
              {onRemove && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs hover:bg-red-500/30 transition-colors cursor-pointer"
                >
                  <X size={13} /> Remove
                </button>
              )}
            </div>

            {/* Upload spinner overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors aspect-video ${
                isDragActive
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border hover:border-accent/50 hover:bg-white/[0.02] text-muted"
              } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <Loader2 size={28} className="animate-spin text-accent" />
              ) : (
                <ImageIcon
                  size={28}
                  className={isDragActive ? "text-accent" : "text-muted"}
                />
              )}

              <div className="text-center">
                <p className="text-sm font-light">
                  {isDragActive
                    ? "Drop the image here"
                    : uploading
                      ? "Uploading..."
                      : "Drag & drop an image"}
                </p>

                {!isDragActive && !uploading && (
                  <p className="text-xs text-muted/60 mt-1">
                    or <span className="text-accent underline">browse</span> ·
                    JPG, PNG, WEBP · max 5 MB
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {dragError && <p className="mt-2 text-xs text-red-400">{dragError}</p>}
    </div>
  );
}
