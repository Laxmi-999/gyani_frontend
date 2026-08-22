"use client";
import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote, useUpdateNote } from "@/app/src/hooks/useNotes";
import { useDeleteFile, useDownloadFile, useFiles, useUploadFile } from "@/app/src/hooks/useFiles";
import { useAuthCheck } from "@/app/src/hooks/useAuth";
import { NoteForm } from "./src/components/NoteForm";
import { NoteCard } from "./src/components/NoteCard";
import { getErrorMessage } from "./src/lib/error";
import { FileAttachments } from "./src/components/FileAttachments";

export default function NotesPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthCheck();
  const [search, setSearch] = useState("");

  const { data: notes, isLoading, isError } = useNotes(search || undefined);
  
  const createMutation = useCreateNote();
  const deleteMutation = useDeleteNote();
  const updateMutation = useUpdateNote(); // <--- Add update mutation
  const { data: files, isLoading: isFilesLoading, isError: isFilesError } = useFiles();
  const uploadFileMutation = useUploadFile();
  const deleteFileMutation = useDeleteFile();
  const downloadFileMutation = useDownloadFile();

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-medium">My notes</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="border border-neutral-700 rounded px-3 py-2 bg-black text-white"
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

      <FileAttachments
        files={files}
        isLoading={isFilesLoading}
        isUploading={uploadFileMutation.isPending}
        isDeleting={deleteFileMutation.isPending}
        isDownloading={downloadFileMutation.isPending}
        onUpload={(file) => uploadFileMutation.mutate({ body: { file } })}
        onDownload={(file) => downloadFileMutation.mutate(file)}
        onDelete={(id) => deleteFileMutation.mutate({ path: { file_id: id } })}
      />
      {isFilesError || uploadFileMutation.isError || deleteFileMutation.isError || downloadFileMutation.isError ? (
        <p className="text-sm text-red-600">Failed to process attachments.</p>
      ) : null}

      {isLoading && <p>Loading notes...</p>}
      {isError && <p className="text-red-600">Failed to load notes.</p>}

      <div className="flex flex-col gap-3">
        {notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={(id) => deleteMutation.mutate({ path: { note_id: id } })}
            onUpdate={(id, updatedData) =>
              updateMutation.mutate({
                path: { note_id: id },
                body: updatedData,
              })
            }
            isUpdating={updateMutation.isPending}
          />
        ))}
        {notes?.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      </div>
    </div>
  );
}