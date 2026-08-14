"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote, fetchNotes } from "./src/lib/notes";
import { NoteForm } from "./src/components/NoteForm";
import { NoteCard } from "./src/components/NoteCard";


export default function NotesPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ["notes", search],
    queryFn: () => fetchNotes(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

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
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
      />

      {isLoading && <p>Loading notes...</p>}
      {isError && <p className="text-red-600">Failed to load notes.</p>}

      <div className="flex flex-col gap-3">
        {notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
        {notes?.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      </div>
    </div>
  );
}