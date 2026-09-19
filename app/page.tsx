"use client";

import { useState, useEffect } from "react";
import { Tag, X } from "lucide-react";
import { useNotes, useSearchNotes, useCreateNote, useDeleteNote, useUpdateNote } from "@/app/src/hooks/useNotes";
import { useFiles, useDeleteFile } from "@/app/src/hooks/useFiles";
import { useAuthCheck } from "@/app/src/hooks/useAuth";
import { Sidebar } from "./src/components/Sidebar";
import { ChatInterface } from "./src/components/ChatInterface";
import { NoteFormModal } from "./src/components/NoteFormModal";
import { NoteDetailModal } from "./src/components/NoteDetailModal";
import { FileDetailModal } from "./src/components/FilesDetailModal";
import { UploadFileModal } from "./src/components/UploadFileModal";
import type { FileOut } from "./src/api/generated/types.gen";
import type { Note } from "./src/types/note";

export default function NotesPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthCheck();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"hybrid" | "semantic">("hybrid");

  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileOut | null>(null);

  useEffect(() => {
    const trimmed = search.trim();
    const timer = setTimeout(() => setDebouncedSearch(trimmed), trimmed === "" ? 0 : 3000);
    return () => clearTimeout(timer);
  }, [search]);

  const isSearchActive = debouncedSearch.length > 0;

  const { data: defaultNotes, isLoading: isNotesLoading } = useNotes(selectedTag || undefined);
  const { data: searchData, isLoading: isSearchLoading } = useSearchNotes(debouncedSearch, searchType);
  const { data: files, isLoading: isFilesLoading } = useFiles();

  const createMutation = useCreateNote();
  const deleteMutation = useDeleteNote();
  const updateMutation = useUpdateNote();
  const deleteFileMutation = useDeleteFile();

  const notes: Note[] = isSearchActive
    ? (searchData?.results ?? []).map((result) => ({
        id: result.id,
        title: result.title ?? "Untitled note",
        content: result.content ?? "",
        tags: null,
        entities: null,
        source_file_id: null,
        created_at: "",
        updated_at: "",
      }))
    : defaultNotes ?? [];
  const isSidebarLoading = isSearchActive ? isSearchLoading : isNotesLoading || isFilesLoading;

  const handleTagSelect = (tag: string) => {
    setSelectedTag((current) => (current === tag ? null : tag));
    setSearch("");
    setDebouncedSearch("");
    setSelectedNote(null);
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] p-6">
        <div className="flex items-center gap-2 text-sm text-[#9a9a9f]">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#33333a] border-t-[#e0a63a]" />
          Checking authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0c] text-[#f2f2f0]">
      <Sidebar
        notes={notes}
        files={files ?? []}
        isLoading={isSidebarLoading}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          if (selectedTag) setSelectedTag(null);
        }}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        isSearchActive={isSearchActive}
        selectedNoteId={selectedNote?.id ?? null}
        onSelectNote={setSelectedNote}
        onSelectFile={setSelectedFile}
        onNewNote={() => setIsNoteFormOpen(true)}
        onUploadFile={() => setIsUploadOpen(true)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {selectedTag && (
          <div className="flex items-center gap-1.5 border-b border-[#242429] px-4 py-2.5 text-xs font-medium text-[#e0a63a]">
            <Tag className="h-3.5 w-3.5" />
            <span>Filtering by: {selectedTag}</span>
            <button onClick={() => setSelectedTag(null)} className="ml-1 rounded p-0.5 hover:bg-[#e0a63a]/10">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <ChatInterface embedded />
      </main>

      <NoteFormModal
        isOpen={isNoteFormOpen}
        onClose={() => setIsNoteFormOpen(false)}
        onSubmit={(data) => createMutation.mutate({ body: data })}
        isSubmitting={createMutation.isPending}
        error={createMutation.isError ? "Failed to create note. Please try again." : null}
      />

      <NoteDetailModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onDelete={(id) => {
          deleteMutation.mutate({ path: { note_id: id } });
          setSelectedNote(null);
        }}
        onUpdate={(id, data) => {
          updateMutation.mutate({ path: { note_id: id }, body: data });
          setSelectedNote((current) => (current?.id === id ? { ...current, ...data } : current));
        }}
        isUpdating={updateMutation.isPending}
        activeTag={selectedTag || undefined}
        onTagClick={handleTagSelect}
      />

      <FileDetailModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={(id) => {
          deleteFileMutation.mutate({ path: { file_id: id } });
          setSelectedFile(null);
        }}
        onDownload={() => {
          // TODO: port your existing download logic from the old
          // FileAttachments component here (blob fetch + save-as).
        }}
      />

      <UploadFileModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}