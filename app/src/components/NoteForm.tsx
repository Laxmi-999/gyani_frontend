"use client";
import { useState } from "react";
import { NoteCreateInput } from "../types/note";

interface Props {
  onSubmit: (data: NoteCreateInput) => void;
  isSubmitting?: boolean;
}

export function NoteForm({ onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({ title, content, tags: tags.trim() || undefined });
    setTitle("");
    setContent("");
    setTags("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded-lg p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border rounded px-3 py-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows={4}
        className="border rounded px-3 py-2"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}