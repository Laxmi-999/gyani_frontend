"use client";

import { useRef, useState } from "react";
import type { FileOut } from "../api/generated/types.gen";

interface FileAttachmentsProps {
  files: FileOut[] | undefined;
  isLoading?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
  isDownloading?: boolean;
  onUpload: (file: File) => void;
  onDownload: (file: FileOut) => void;
  onDelete: (id: number) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileAttachments({
  files,
  isLoading,
  isUploading,
  isDeleting,
  isDownloading,
  onUpload,
  onDownload,
  onDelete,
}: FileAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedOcrId, setExpandedOcrId] = useState<number | null>(null);

  function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedFile || isUploading) return;
    onUpload(selectedFile);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const toggleOcrPreview = (id: number) => {
    setExpandedOcrId((prev) => (prev === id ? null : id));
  };

  const getOcrBadge = (status?: string | null) => {
    if (!status) return null;
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">OCR Ready</span>;
      case "PENDING":
      case "PROCESSING":
        return <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400 border border-yellow-500/20 animate-pulse">Extracting Text...</span>;
      case "FAILED":
        return <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400 border border-red-500/20">OCR Failed</span>;
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col gap-4 border border-neutral-800 rounded-lg p-4 bg-neutral-950">
      <div>
        <h2 className="font-semibold text-lg text-white">Attachments</h2>
        <p className="text-sm text-neutral-500 mt-1">Keep reference files with your notes.</p>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2">
        <input
          ref={inputRef}
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 rounded border border-neutral-700 px-3 py-2 text-sm text-neutral-300 file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-white"
        />
        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50 hover:bg-neutral-200 transition-colors"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {isLoading ? <p className="text-sm text-neutral-500">Loading attachments...</p> : null}
      {!isLoading && files?.length === 0 ? (
        <p className="text-sm text-neutral-500">No attachments yet.</p>
      ) : null}

      <div className="flex flex-col gap-3">
        {files?.map((file) => {
          const fileWithOcr = file as FileOut & { ocr_status?: string | null; ocr_text?: string | null };

          return (
            <div key={file.id} className="flex flex-col border-t border-neutral-800 pt-3 gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-neutral-200">{file.filename}</p>
                    {getOcrBadge(fileWithOcr.ocr_status)}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {formatFileSize(file.file_size)} · {new Date(file.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-sm">
                  {fileWithOcr.ocr_text && (
                    <button
                      type="button"
                      onClick={() => toggleOcrPreview(file.id)}
                      className="text-emerald-400 hover:underline font-medium"
                    >
                      {expandedOcrId === file.id ? "Hide Text" : "View Text"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDownload(file)}
                    disabled={isDownloading}
                    className="text-blue-400 hover:underline disabled:opacity-50"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(file.id)}
                    disabled={isDeleting}
                    className="text-red-400 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedOcrId === file.id && fileWithOcr.ocr_text && (
                <div className="mt-2 rounded bg-neutral-900 p-3 border border-neutral-800 text-xs text-neutral-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  <div className="flex justify-between items-center mb-1 pb-1 border-b border-neutral-800 text-neutral-400 font-mono">
                    <span>Extracted Content</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(fileWithOcr.ocr_text || "")}
                      className="hover:text-white"
                    >
                      Copy
                    </button>
                  </div>
                  {fileWithOcr.ocr_text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}