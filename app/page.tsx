"use client";

import { useState } from "react";
import { Search, NotebookPen, Tag, X } from "lucide-react";
import {
  useNotes,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "@/app/src/hooks/useNotes";
import { useAuthCheck } from "@/app/src/hooks/useAuth";
import { NoteForm } from "./src/components/NoteForm";
import { NoteCard } from "./src/components/NoteCard";
import { getErrorMessage } from "./src/lib/error";
import { FileAttachments } from "./src/components/FileAttachments";

export default function NotesPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthCheck();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Pass active search query or selected tag to hook
  const activeQuery = selectedTag || search || undefined;
  const { data: notes, isLoading, isError } = useNotes(activeQuery);

  const createMutation = useCreateNote();
  const deleteMutation = useDeleteNote();
  const updateMutation = useUpdateNote();

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setSearch(""); // Reset search bar if tag clicked
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-[#9a9a9f]">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#33333a] border-t-[#e0a63a]" />
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-6 text-[#f2f2f0] lg:p-10">
      {/* Header — full width */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-[#e0a63a]" strokeWidth={2} />
          <h1 className="text-xl font-semibold tracking-tight">My notes</h1>
          {notes && notes.length > 0 && (
            <span className="ml-1 rounded-full bg-[#18181c] px-2 py-0.5 text-xs font-medium text-[#9a9a9f]">
              {notes.length}
            </span>
          )}
        </div>
        <p className="text-sm text-[#6b6b70]">
          Capture ideas and keep them organized in one place.
        </p>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left rail — compose + attachments, sticky on scroll */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 lg:h-fit">
          <div className="flex flex-col gap-2">
            <NoteForm
              onSubmit={(data) => createMutation.mutate({ body: data })}
              isSubmitting={createMutation.isPending}
            />
            {createMutation.isError && (
              <p className="text-sm text-[#ff6b6f]">
                {getErrorMessage(
                  createMutation.error,
                  "Failed to create note."
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#6b6b70]">
              Attachments
            </h2>
            <FileAttachments />
          </div>
        </div>

        {/* Right — search + filter bar + notes grid */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b70]" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (selectedTag) setSelectedTag(null);
                }}
                placeholder="Search notes or tags..."
                className="w-full rounded-lg border border-[#242429] bg-[#131316] py-2.5 pl-10 pr-3 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] transition-colors focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
              />
            </div>

            {/* Active Tag Pill Indicator */}
            {selectedTag && (
              <div className="flex items-center gap-1.5 rounded-lg border border-[#e0a63a]/40 bg-[#e0a63a]/10 px-3 py-2 text-xs font-medium text-[#e0a63a]">
                <Tag className="h-3.5 w-3.5" />
                <span>Tag: {selectedTag}</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="ml-1 rounded p-0.5 hover:bg-[#e0a63a]/20"
                  title="Clear tag filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-lg border border-[#242429] bg-[#131316]"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-1 rounded-lg border border-[#3a2323] bg-[#1a1414] px-4 py-10 text-center">
              <p className="text-sm font-medium text-[#ff6b6f]">
                Couldn't load your notes
              </p>
              <p className="text-xs text-[#6b6b70]">
                Check your connection and try again.
              </p>
            </div>
          )}

          {!isLoading && !isError && notes?.length === 0 && (
            <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-[#242429] px-4 py-16 text-center">
              <NotebookPen className="mb-2 h-6 w-6 text-[#33333a]" />
              <p className="text-sm font-medium text-[#9a9a9f]">
                {activeQuery ? "No notes match your filter" : "No notes yet"}
              </p>
              <p className="text-xs text-[#6b6b70]">
                {activeQuery
                  ? "Try searching for a different term or clearing tag filters."
                  : "Add your first note or upload an attachment to get started."}
              </p>
            </div>
          )}

          {notes && notes.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  activeTag={selectedTag || undefined}
                  onTagClick={handleTagSelect}
                  onDelete={(id) =>
                    deleteMutation.mutate({ path: { note_id: id } })
                  }
                  onUpdate={(id, updatedData) =>
                    updateMutation.mutate({
                      path: { note_id: id },
                      body: updatedData,
                    })
                  }
                  isUpdating={updateMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}