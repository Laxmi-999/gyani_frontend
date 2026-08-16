"use client";
import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "@/app/src/hooks/useNotes";
import { NoteForm } from "./src/components/NoteForm";
import { NoteCard } from "./src/components/NoteCard";
import { getErrorMessage } from "./src/lib/error";

export default function NotesPage() {
  const [search, setSearch] = useState("");

  const { data: notes, isLoading, isError } = useNotes(search || undefined);
  const createMutation = useCreateNote();
  const deleteMutation = useDeleteNote();

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-medium">My notes</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="border rounded px-3 py-2"
      />

      <NoteForm
        onSubmit={(data) => createMutation.mutate({ body: data })}
        isSubmitting={createMutation.isPending}
      />
      {createMutation.isError ? (
        <p className="text-sm text-red-600">
          {getErrorMessage(createMutation.error, "Failed to create note.")}
        </p>
      ) : null}

      {isLoading && <p>Loading notes...</p>}
      {isError && <p className="text-red-600">Failed to load notes.</p>}

      <div className="flex flex-col gap-3">
        {notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={(id) => deleteMutation.mutate({ path: { note_id: id } })}
          />
        ))}
        {notes?.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      </div>
    </div>
  );
}