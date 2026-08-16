import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNoteNotesPostMutation, deleteNoteNotesNoteIdDeleteMutation, getNoteNotesNoteIdGetOptions, listNotesNotesGetOptions, updateNoteNotesNoteIdPatchMutation } from "../api/generated/@tanstack/react-query.gen";


const notesListKey = ["listNotesNotesGet"];

export function useNotes(search?: string) {
  return useQuery({
    ...listNotesNotesGetOptions({ query: search ? { q: search } : {} }),
  });
}

export function useNote(noteId: number) {
  return useQuery({
    ...getNoteNotesNoteIdGetOptions({ path: { note_id: noteId } }),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    ...createNoteNotesPostMutation(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesListKey });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateNoteNotesNoteIdPatchMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesListKey });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteNoteNotesNoteIdDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesListKey });
    },
  });
}