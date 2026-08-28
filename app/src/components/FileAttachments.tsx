"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Eye,
  EyeOff,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useFiles, useUploadFile, useDeleteFile, useDownloadFile } from "@/app/src/hooks/useFiles";
import type { FileOut } from "@/app/src/api/generated/types.gen";

function StatusBadge({ status }: { status: FileOut["ocr_status"] }) {
  if (status === "completed") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-[#1f4d3a] bg-[#0f2a20] px-2 py-0.5 text-xs font-medium text-[#4ade80] sm:flex">
        <CheckCircle2 className="h-3 w-3" />
        Extracted
      </span>
    );
  }
  if (status === "pending" || status === "processing") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-[#3a3320] bg-[#2a2413] px-2 py-0.5 text-xs font-medium text-[#e0a63a] sm:flex">
        <Loader2 className="h-3 w-3 animate-spin" />
        {status === "pending" ? "Queued" : "Processing"}
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-[#3a2323] bg-[#2a1414] px-2 py-0.5 text-xs font-medium text-[#ff6b6f] sm:flex">
        <AlertCircle className="h-3 w-3" />
        Failed
      </span>
    );
  }
  return null;
}

export function FileAttachments() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const { data: files, isLoading, isError } = useFiles();
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();
  const downloadMutation = useDownloadFile();

  function handleUpload() {
    if (!selectedFile) return;
    uploadMutation.mutate(
      { body: { file: selectedFile } },
      { onSuccess: () => setSelectedFile(null) }
    );
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Upload row */}
      <div className="flex flex-col gap-2 rounded-lg border border-[#242429] bg-[#131316] p-3 sm:flex-row sm:items-center sm:gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#242429] bg-[#18181c] px-3 py-2 text-sm font-medium text-[#f2f2f0] transition-colors hover:bg-[#1f1f24]">
          <Paperclip className="h-3.5 w-3.5 text-[#9a9a9f]" />
          Choose file
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <span className="flex-1 truncate text-sm text-[#6b6b70]">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </span>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#e0a63a] px-4 py-2 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              Upload
            </>
          )}
        </button>
      </div>

      {uploadMutation.isError && (
        <p className="text-sm text-[#ff6b6f]">Failed to upload file.</p>
      )}

      {/* File list */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border border-[#242429] bg-[#131316]" />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-[#3a2323] bg-[#1a1414] px-4 py-3 text-sm text-[#ff6b6f]">
          Couldn't load attachments.
        </p>
      )}

      {!isLoading && !isError && files?.length === 0 && (
        <p className="rounded-lg border border-dashed border-[#242429] px-4 py-6 text-center text-sm text-[#6b6b70]">
          No files attached yet.
        </p>
      )}

      {files && files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file) => {
            const isExpanded = expandedId === file.id;
            const canViewText = file.ocr_status === "completed" && !!file.extracted_text;
            const isDownloading = downloadMutation.isPending && downloadMutation.variables?.id === file.id;

            return (
              <div
                key={file.id}
                className="rounded-lg border border-[#242429] bg-[#131316] transition-colors hover:border-[#33333a]"
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-[#6b6b70]" />

                  <span className="min-w-0 flex-1 truncate text-sm text-[#f2f2f0]" title={file.filename}>
                    {file.filename}
                  </span>

                  <StatusBadge status={file.ocr_status} />

                  {confirmingDeleteId === file.id ? (
                    <div className="flex shrink-0 items-center gap-1 text-xs">
                      <span className="mr-1 text-[#6b6b70]">Delete?</span>
                      <button
                        onClick={() => {
                          deleteMutation.mutate({ path: { file_id: file.id } });
                          setConfirmingDeleteId(null);
                        }}
                        className="rounded p-1 text-[#ff6b6f] hover:bg-[#ff6b6f]/10"
                        aria-label="Confirm delete"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        className="rounded p-1 text-[#9a9a9f] hover:bg-[#18181c]"
                        aria-label="Cancel delete"
                      >
                        <EyeOff className="hidden h-0 w-0" />
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-0.5">
                      {canViewText && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : file.id)}
                          className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#e0a63a]"
                          title={isExpanded ? "Hide text" : "View extracted text"}
                        >
                          {isExpanded ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      )}
                      <button
                        onClick={() => downloadMutation.mutate(file)}
                        disabled={isDownloading}
                        className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#5eaeff] disabled:opacity-40"
                        title="Download"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(file.id)}
                        className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#ff6b6f]"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {isExpanded && canViewText && (
                  <div className="border-t border-[#242429] px-3 py-3">
                    <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-[#9a9a9f]">
                      {file.extracted_text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}