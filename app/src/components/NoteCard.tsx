"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  FileText,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  score?: number;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: { title: string; content: string; tags?: string }
  ) => void;
  isUpdating?: boolean;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
}

// Quieter than colored badges — a small dot carries the category,
// text stays neutral so the card doesn't read as confetti.
const entityDotColor: Record<string, string> = {
  PERSON: "#60a5fa",
  GPE: "#34d399",
  ORG: "#c084fc",
  MONEY: "#fbbf24",
  DATE: "#fb7185",
};

const CONTENT_PREVIEW_LIMIT = 220;
const ENTITY_PREVIEW_LIMIT = 4;

export function NoteCard({
  note,
  score,
  onDelete,
  onUpdate,
  isUpdating,
  onTagClick,
  activeTag,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllEntities, setShowAllEntities] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags ?? "");

  const tagList = note.tags
    ? note.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const flatEntities = note.entities
    ? Object.entries(note.entities).flatMap(([category, items]) =>
        Array.isArray(items)
          ? items.map((value) => ({ category, value }))
          : []
      )
    : [];
  const visibleEntities = showAllEntities
    ? flatEntities
    : flatEntities.slice(0, ENTITY_PREVIEW_LIMIT);
  const hiddenEntityCount = flatEntities.length - visibleEntities.length;

  const isLongContent = note.content.length > CONTENT_PREVIEW_LIMIT;
  const displayContent =
    isExpanded || !isLongContent
      ? note.content
      : note.content.slice(0, CONTENT_PREVIEW_LIMIT).trimEnd() + "…";

  function handleSave() {
    if (!title.trim() || !content.trim()) return;
    onUpdate(note.id, {
      title: title.trim(),
      content: content.trim(),
      tags: tags.trim() || undefined,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags ?? "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-[#e0a63a]/40 bg-[#131316] p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="min-h-[90px] resize-y rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="rounded-md border border-[#242429] bg-[#0a0a0c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-md border border-[#242429] px-3 py-1.5 text-sm text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#f2f2f0]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="rounded-md bg-[#e0a63a] px-3 py-1.5 text-sm font-medium text-[#141008] transition-colors hover:bg-[#f0b64a] disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-2.5 rounded-lg border border-[#242429] bg-[#131316] p-4 transition-colors hover:border-[#33333a]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          {note.source_file_id && (
            <FileText className="h-3.5 w-3.5 shrink-0 text-[#e0a63a]" />
          )}
          <h3 className="truncate font-semibold leading-tight text-[#f2f2f0]">
            {note.title}
          </h3>
          {score !== undefined && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#e0a63a]/30 bg-[#e0a63a]/10 px-2 py-0.5 text-[10px] font-medium text-[#e0a63a]"
              title="Search relevance score"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {(score * 100).toFixed(0)}%
            </span>
          )}
        </div>

        {confirmingDelete ? (
          <div className="flex shrink-0 items-center gap-1 text-xs">
            <span className="mr-1 text-[#6b6b70]">Delete note?</span>
            <button
              onClick={() => {
                onDelete(note.id);
                setConfirmingDelete(false);
              }}
              className="rounded p-1 text-[#ff6b6f] hover:bg-[#ff6b6f]/10"
              aria-label="Confirm delete"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="rounded p-1 text-[#9a9a9f] hover:bg-[#18181c]"
              aria-label="Cancel delete"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#e0a63a]"
              aria-label="Edit note"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              className="rounded p-1.5 text-[#9a9a9f] transition-colors hover:bg-[#18181c] hover:text-[#ff6b6f]"
              aria-label="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content — truncated by default so a full OCR'd document doesn't take over the grid */}
      <div className="flex flex-col gap-1">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#9a9a9f]">
          {displayContent}
        </p>
        {isLongContent && (
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="flex w-fit items-center gap-0.5 text-xs font-medium text-[#e0a63a] hover:text-[#f0b64a]"
          >
            {isExpanded ? "Show less" : "Show more"}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Manual tags */}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagList.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className={`rounded-full border border-[#242429] bg-[#0a0a0c] px-2 py-0.5 text-xs text-[#9a9a9f] transition-colors hover:border-[#e0a63a]/40 hover:text-[#f2f2f0] ${
                  isActive ? "border-[#e0a63a] text-[#e0a63a]" : ""
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Extracted entities — dot-marker style, collapsed past a handful */}
      {flatEntities.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#242429] pt-2.5">
          {visibleEntities.map(({ category, value }, idx) => {
            const isActive = activeTag === value;
            const dot = entityDotColor[category] ?? "#6b6b70";
            return (
              <button
                key={`${category}-${idx}`}
                onClick={() => onTagClick?.(value)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[#242429] bg-[#0a0a0c] px-2 py-0.5 text-[11px] text-[#9a9a9f] transition-colors hover:border-[#33333a] hover:text-[#f2f2f0] ${
                  isActive ? "border-[#e0a63a] text-[#e0a63a]" : ""
                }`}
                title={category}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: dot }}
                />
                {value}
              </button>
            );
          })}
          {hiddenEntityCount > 0 && (
            <button
              onClick={() => setShowAllEntities(true)}
              className="text-[11px] font-medium text-[#6b6b70] hover:text-[#e0a63a]"
            >
              +{hiddenEntityCount} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}