"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { title: string; content: string; tags?: string }) => void;
  isUpdating?: boolean;
}

export function NoteCard({ note, onDelete, onUpdate, isUpdating }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags ?? "");

  const tagList = note.tags
    ? note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  function handleSave() {
    if (!title.trim() || !content.trim()) return;
    onUpdate(note.id, { title: title.trim(), content: content.trim(), tags: tags.trim() || undefined });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags ?? "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-[#e0a63a]/40 bg-[#131316] p-4 shadow-[0_0_0_1px_rgba(224,166,58,0.08)]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="min-h-[90px] resize-y rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-md border border-[#242429] px-3 py-1.5 text-sm text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#f2f2f0]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="rounded-md bg-[#e0a63a] px-3 py-1.5 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a] disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-2 rounded-lg border border-[#242429] bg-[#131316] p-4 transition-colors hover:border-[#33333a]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-tight text-[#f2f2f0]">{note.title}</h3>

        {confirmingDelete ? (
          <div className="flex shrink-0 items-center gap-1 text-xs">
            <span className="mr-1 text-[#6b6b70]">Delete note?</span>
            <button
              onClick={() => {
                onDelete(note.id);
                setConfirmingDelete(false);
              }}
              className="rounded p-1 text-[#ff6b6f] hover:bg-[#ff6b6f]/10"
              aria-label="Confirm delete"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded p-1 text-[#9a9a9f] hover:bg-[#18181c]"
              aria-label="Cancel delete"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#e0a63a]"
              aria-label="Edit note"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#ff6b6f]"
              aria-label="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#9a9a9f]">{note.content}</p>

      {tagList.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tagList.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#242429] bg-[#0a0a0c] px-2 py-0.5 text-xs text-[#9a9a9f]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}