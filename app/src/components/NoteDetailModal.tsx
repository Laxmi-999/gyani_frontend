"use client";

import { Modal } from "./Modal";
import { NoteCard } from "./NoteCard";
import type { Note } from "../types/note";

interface NoteDetailModalProps {
  note: Note | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { title: string; content: string; tags?: string }) => void;
  isUpdating?: boolean;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
}

export function NoteDetailModal({
  note,
  onClose,
  onDelete,
  onUpdate,
  isUpdating,
  onTagClick,
  activeTag,
}: NoteDetailModalProps) {
  return (
    <Modal isOpen={!!note} onClose={onClose} title="Note">
      {note && (
        <NoteCard
          note={note}
          defaultExpanded
          activeTag={activeTag}
          onTagClick={onTagClick}
          onDelete={(id) => {
            onDelete(id);
            onClose();
          }}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
        />
      )}
    </Modal>
  );
}