"use client";

import { Modal } from "./Modal";
import { NoteForm } from "./NoteForm";

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; tags?: string }) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function NoteFormModal({ isOpen, onClose, onSubmit, isSubmitting, error }: NoteFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New note">
      <div className="flex flex-col gap-2">
        <NoteForm
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
          isSubmitting={isSubmitting}
        />
        {error && <p className="text-sm text-[#ff6b6f]">{error}</p>}
      </div>
    </Modal>
  );
}