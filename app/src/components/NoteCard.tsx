"use client";
import { Note } from "../types/note";

interface Props {
  note: Note;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onDelete }: Props) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{note.title}</h3>
        <button
          onClick={() => onDelete(note.id)}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
      {note.tags && (
        <span className="text-xs text-gray-400">{note.tags}</span>
      )}
    </div>
  );
}