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

  function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedFile || isUploading) return;
    onUpload(selectedFile);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="flex flex-col gap-4 border border-neutral-800 rounded-lg p-4 bg-neutral-950">
      <div>
        <h2 className="font-semibold text-lg">Attachments</h2>
        <p className="text-sm text-neutral-500 mt-1">Keep reference files with your notes.</p>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-2">
        <input
          ref={inputRef}
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 rounded border border-neutral-700 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-white"
        />
        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {isLoading ? <p className="text-sm text-neutral-500">Loading attachments...</p> : null}
      {!isLoading && files?.length === 0 ? (
        <p className="text-sm text-neutral-500">No attachments yet.</p>
      ) : null}

      <div className="flex flex-col gap-2">
        {files?.map((file) => (
          <div key={file.id} className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.filename}</p>
              <p className="text-xs text-neutral-500">
                {formatFileSize(file.file_size)} · {new Date(file.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <button type="button" onClick={() => onDownload(file)} disabled={isDownloading} className="text-blue-400 hover:underline disabled:opacity-50">
                Download
              </button>
              <button type="button" onClick={() => onDelete(file.id)} disabled={isDeleting} className="text-red-400 hover:underline disabled:opacity-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}