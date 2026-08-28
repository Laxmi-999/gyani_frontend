"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { NoteCreateInput } from "../types/note";

interface Props {
  onSubmit: (data: NoteCreateInput) => void;
  isSubmitting?: boolean;
}

export function NoteForm({ onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({ title: title.trim(), content: content.trim(), tags: tags.trim() || undefined });
    setTitle("");
    setContent("");
    setTags("");
  }

  const inputClasses =
    "rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2.5 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] transition-colors focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-[#242429] bg-[#131316] p-4"
    >
      <label className="sr-only" htmlFor="note-title">Title</label>
      <input
        id="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className={inputClasses}
      />

      <label className="sr-only" htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows={4}
        className={`${inputClasses} resize-y`}
      />

      <label className="sr-only" htmlFor="note-tags">Tags</label>
      <input
        id="note-tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className={inputClasses}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-1.5 rounded-md bg-[#e0a63a] px-4 py-2.5 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a] disabled:opacity-50"
      >
        {isSubmitting ? (
          "Saving..."
        ) : (
          <>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add note
          </>
        )}
      </button>
    </form>
  );
}