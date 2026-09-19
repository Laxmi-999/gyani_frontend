"use client";

import { useMemo } from "react";
import { Search, NotebookPen, Plus, Paperclip, FileText, Sparkles } from "lucide-react";
import type { FileOut } from "../api/generated/types.gen";
import type { Note } from "../types/note";

type SidebarItem =
  | { kind: "note"; id: string; title: string; raw: Note }
  | { kind: "file"; id: string; title: string; raw: FileOut };

interface SidebarProps {
  notes: Note[];
  files: FileOut[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  searchType: "hybrid" | "semantic";
  onSearchTypeChange: (type: "hybrid" | "semantic") => void;
  isSearchActive: boolean;
  selectedNoteId: number | null;
  onSelectNote: (note: Note) => void;
  onSelectFile: (file: FileOut) => void;
  onNewNote: () => void;
  onUploadFile: () => void;
}

export function Sidebar({
  notes,
  files,
  isLoading,
  search,
  onSearchChange,
  searchType,
  onSearchTypeChange,
  isSearchActive,
  selectedNoteId,
  onSelectNote,
  onSelectFile,
  onNewNote,
  onUploadFile,
}: SidebarProps) {
  const items: SidebarItem[] = useMemo(() => {
    const noteItems: SidebarItem[] = notes.map((n) => ({
      kind: "note",
      id: `note-${n.id}`,
      title: n.title || "Untitled note",
      raw: n,
    }));
    const fileItems: SidebarItem[] = files.map((f) => ({
      kind: "file",
      id: `file-${f.id}`,
      title: f.filename || "Untitled file",
      raw: f,
    }));
    return [...noteItems, ...fileItems];
  }, [notes, files]);

  return (
    <aside className="flex h-full w-full max-w-[280px] shrink-0 flex-col border-r border-[#242429] bg-[#0a0a0c]">
      <div className="flex items-center gap-2 px-4 py-4">
        <NotebookPen className="h-4 w-4 text-[#e0a63a]" strokeWidth={2} />
        <span className="text-sm font-semibold tracking-tight">Gyani</span>
      </div>

      <div className="flex flex-col gap-2 px-3">
        <button
          onClick={onNewNote}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#e0a63a] px-3 py-2 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a]"
        >
          <Plus className="h-4 w-4" />
          New note
        </button>
        <button
          onClick={onUploadFile}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-[#242429] px-3 py-2 text-sm text-[#9a9a9f] transition-colors hover:border-[#33333a] hover:text-[#f2f2f0]"
        >
          <Paperclip className="h-3.5 w-3.5" />
          Upload file
        </button>
      </div>

      <div className="flex flex-col gap-2 px-3 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b6b70]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-lg border border-[#242429] bg-[#131316] py-2 pl-8 pr-2 text-xs text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
          />
        </div>
        {isSearchActive && (
          <div className="flex items-center gap-1 self-start rounded-lg border border-[#242429] bg-[#131316] p-1">
            <button
              onClick={() => onSearchTypeChange("hybrid")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                searchType === "hybrid" ? "bg-[#242429] text-[#e0a63a]" : "text-[#6b6b70] hover:text-[#f2f2f0]"
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => onSearchTypeChange("semantic")}
              className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                searchType === "semantic" ? "bg-[#242429] text-[#e0a63a]" : "text-[#6b6b70] hover:text-[#f2f2f0]"
              }`}
            >
              <Sparkles className="h-2.5 w-2.5" />
              Semantic
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex-1 overflow-y-auto px-2 pb-4">
        {isLoading && (
          <div className="flex flex-col gap-1.5 px-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-md bg-[#131316]" />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-[#6b6b70]">Nothing here yet</p>
        )}

        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive = item.kind === "note" && selectedNoteId === item.raw.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => (item.kind === "note" ? onSelectNote(item.raw) : onSelectFile(item.raw))}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                    isActive ? "bg-[#18181c] text-[#f2f2f0]" : "text-[#9a9a9f] hover:bg-[#131316] hover:text-[#f2f2f0]"
                  }`}
                >
                  {item.kind === "note" ? (
                    <FileText className="h-3.5 w-3.5 shrink-0 text-[#6b6b70]" />
                  ) : (
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-[#6b6b70]" />
                  )}
                  <span className="truncate">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}