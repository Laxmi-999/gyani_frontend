"use client";

import { useState } from "react";

interface NoteCardProps {
  note: any;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: { title: string; content: string; tags?: string }) => void;
  isUpdating?: boolean;
}


export function NoteCard({ note, onDelete, onUpdate, isUpdating }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags || "");

const handleSave = () => {
  onUpdate(note.id, { 
    title: title ?? note.title ?? "", 
    content: content ?? note.content ?? "", 
    tags: tags ?? note.tags ?? "" 
  });
  setIsEditing(false);
};

  if (isEditing) {
    return (
      <div className="border border-blue-500 rounded p-4 flex flex-col gap-3 bg-neutral-900">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-1 bg-black text-white"
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded px-3 py-1 bg-black text-white min-h-[80px]"
          placeholder="Content"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border rounded px-3 py-1 bg-black text-white"
          placeholder="Tags (comma separated)"
        />
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm rounded border border-gray-600 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-700 rounded p-4 flex flex-col gap-2 relative bg-neutral-950">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{note.title}</h3>
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm whitespace-pre-wrap">{note.content}</p>
      {note.tags && <p className="text-xs text-gray-500 mt-1">{note.tags}</p>}
    </div>
  );
}