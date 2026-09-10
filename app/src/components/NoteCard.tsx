"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  User,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Tag as TagIcon,
  FileText,
  Sparkles,
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

const entityBadgeConfig: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  PERSON: {
    bg: "bg-blue-950/40",
    text: "text-blue-300",
    border: "border-blue-500/30",
    icon: User,
  },
  GPE: {
    bg: "bg-emerald-950/40",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    icon: MapPin,
  },
  ORG: {
    bg: "bg-purple-950/40",
    text: "text-purple-300",
    border: "border-purple-500/30",
    icon: Building,
  },
  MONEY: {
    bg: "bg-amber-950/40",
    text: "text-amber-300",
    border: "border-amber-500/30",
    icon: DollarSign,
  },
  DATE: {
    bg: "bg-rose-950/40",
    text: "text-rose-300",
    border: "border-rose-500/30",
    icon: Calendar,
  },
};

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
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags ?? "");

  const tagList = note.tags
    ? note.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

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
      <div className="flex flex-col gap-3 rounded-lg border border-[#e0a63a]/40 bg-[#131316] p-4 shadow-[0_0_0_1px_rgba(224,166,58,0.08)]">
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
    <div className="group flex flex-col gap-2 rounded-lg border border-[#242429] bg-[#131316] p-4 transition-colors hover:border-[#33333a]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          {note.source_file_id && (
            <FileText
              className="h-3.5 w-3.5 shrink-0 text-[#e0a63a]"
            />
          )}
          <h3 className="font-semibold leading-tight text-[#f2f2f0] truncate">
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

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#9a9a9f]">
        {note.content}
      </p>

      {/* Manual Tags */}
      {tagList.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
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

      {/* Extracted Entities Badges */}
      {note.entities && Object.keys(note.entities).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-[#242429] pt-2.5">
          {Object.entries(note.entities).map(([category, items]) => {
            if (!Array.isArray(items) || items.length === 0) return null;

            const config = entityBadgeConfig[category] || {
              bg: "bg-[#0a0a0c]",
              text: "text-[#9a9a9f]",
              border: "border-[#242429]",
              icon: TagIcon,
            };
            const Icon = config.icon;

            return items.map((item, idx) => {
              const isActive = activeTag === item;
              return (
                <button
                  key={`${category}-${idx}`}
                  onClick={() => onTagClick?.(item)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all hover:opacity-80 ${
                    config.bg
                  } ${config.text} ${config.border} ${
                    isActive ? "ring-1 ring-[#e0a63a]" : ""
                  }`}
                  title={`Filter by ${category}: ${item}`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item}</span>
                </button>
              );
            });
          })}
        </div>
      )}
    </div>
  );
}