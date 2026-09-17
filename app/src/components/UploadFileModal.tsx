"use client";

import { useState } from "react";
import { Upload, File as FileIcon } from "lucide-react";
import { Modal } from "./Modal";
import { useUploadFile } from "@/app/src/hooks/useFiles";
import { getErrorMessage } from "../lib/error";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadFileModal({ isOpen, onClose }: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadFile();

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(
      // NOTE: adjust the "file" key below if your generated
      // UploadFileFilesPostData body expects a different field name.
      { body: { file } as any },
      {
        onSuccess: () => {
          setFile(null);
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload file">
      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#242429] px-4 py-8 text-center transition-colors hover:border-[#e0a63a]/40">
          <Upload className="h-5 w-5 text-[#6b6b70]" />
          <span className="text-sm text-[#9a9a9f]">
            {file ? file.name : "Choose a file to upload"}
          </span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        {file && (
          <div className="flex items-center gap-2 rounded-lg border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0]">
            <FileIcon className="h-3.5 w-3.5 text-[#e0a63a]" />
            <span className="truncate">{file.name}</span>
          </div>
        )}

        {uploadMutation.isError && (
          <p className="text-sm text-[#ff6b6f]">
            {getErrorMessage(uploadMutation.error, "Failed to upload file.")}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
          className="rounded-lg bg-[#e0a63a] px-3 py-2 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </button>
      </div>
    </Modal>
  );
}