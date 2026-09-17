"use client";

import { Download, Trash2 } from "lucide-react";
import { Modal } from "./Modal";

interface FileDetailModalProps {
  file: any | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
}

export function FileDetailModal({ file, onClose, onDelete, onDownload }: FileDetailModalProps) {
  return (
    <Modal isOpen={!!file} onClose={onClose} title="File">
      {file && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-[#f2f2f0]">
              {file.filename || file.original_filename || file.name}
            </p>
            {file.status && (
              <span className="mt-1 inline-flex items-center rounded-full border border-[#2f5c3a] bg-[#0f2417] px-2 py-0.5 text-[11px] font-medium text-[#4ade80]">
                {file.status}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(file.id)}
              className="flex items-center gap-1.5 rounded-lg border border-[#242429] px-3 py-1.5 text-sm text-[#9a9a9f] hover:border-[#33333a] hover:text-[#f2f2f0]"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              onClick={() => {
                onDelete(file.id);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#242429] px-3 py-1.5 text-sm text-[#ff6b6f] hover:border-[#ff6b6f]/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}