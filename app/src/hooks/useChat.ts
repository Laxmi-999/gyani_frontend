import { useMutation } from "@tanstack/react-query";
import { chatWithNotesNotesChatPostMutation } from "../api/generated/@tanstack/react-query.gen";

/**
 * RAG chat hook — sends a question to POST /notes/chat and returns
 * the generated answer plus the source notes it was grounded in.
 */
export function useChatWithNotes() {
  return useMutation({
    ...chatWithNotesNotesChatPostMutation(),
  });
}