import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createNoteNotesPostMutation, 
  deleteNoteNotesNoteIdDeleteMutation, 
  getNoteNotesNoteIdGetOptions, 
  listFilesFilesGetQueryKey, 
  listNotesNotesGetOptions, 
  searchNotesNotesSearchGetOptions, 
  updateNoteNotesNoteIdPatchMutation 
} from "../api/generated/@tanstack/react-query.gen";

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
      queryClient.invalidateQueries({
        queryKey: listNotesNotesGetOptions().queryKey,
      });
    },
  });
}


export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateNoteNotesNoteIdPatchMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listNotesNotesGetOptions().queryKey,
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteNoteNotesNoteIdDeleteMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listNotesNotesGetOptions().queryKey,
      });
      // Invalidate files so attached statuses update accordingly
      queryClient.invalidateQueries({
        queryKey: listFilesFilesGetQueryKey(),
      });
    },
  });
}

export function useSearchNotes(q: string, type: "hybrid" | "semantic" = "hybrid") {
  return useQuery({
    ...searchNotesNotesSearchGetOptions({
      query: { q, type, limit: 10 },
    }),
    enabled: q.trim().length > 0, // Only fire request when search input is not empty
  });
}