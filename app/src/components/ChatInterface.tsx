"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Loader2, FileText } from "lucide-react";
import { useChatWithNotes } from "@/app/src/hooks/useChat";
import { getErrorMessage } from "../lib/error";

type SourceNote = {
  id: number;
  title?: string | null;
  content?: string | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: SourceNote[];
};

interface ChatInterfaceProps {
  /** Drop the built-in header/border/fixed-height chrome when a parent (e.g. a panel) already provides it. */
  embedded?: boolean;
}

export function ChatInterface({ embedded = false }: ChatInterfaceProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatWithNotes();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, chatMutation.isPending]);

  const handleSend = () => {
    const trimmed = question.trim();
    if (!trimmed || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");

    chatMutation.mutate(
      { body: { question: trimmed } },
      {
        onSuccess: (data: any) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data?.answer ?? "No answer returned.",
              sources: data?.sources ?? [],
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I couldn't process that question. Please try again.",
            },
          ]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={
        embedded
          ? "flex h-full flex-col"
          : "flex h-[600px] flex-col rounded-lg border border-[#242429] bg-[#131316]"
      }
    >
      {!embedded && (
        <div className="flex items-center gap-2 border-b border-[#242429] px-4 py-3">
          <MessageSquare className="h-4 w-4 text-[#e0a63a]" strokeWidth={2} />
          <h2 className="text-sm font-semibold text-[#f2f2f0]">Ask your notes</h2>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <MessageSquare className="mb-2 h-6 w-6 text-[#33333a]" />
            <p className="text-sm font-medium text-[#9a9a9f]">
              Ask a question about your notes
            </p>
            <p className="text-xs text-[#6b6b70]">
              I&apos;ll answer using only what&apos;s in your notes, and show
              you the sources.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-[#e0a63a]/15 text-[#f2f2f0]"
                  : "border border-[#242429] bg-[#18181c] text-[#f2f2f0]"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-[#242429] pt-2.5">
                  {msg.sources.map((source) => (
                    <a
                      key={source.id}
                      href={`/notes/${source.id}`}
                      className="flex items-center gap-1 rounded-full border border-[#242429] bg-[#131316] px-2 py-1 text-xs text-[#9a9a9f] transition-colors hover:border-[#e0a63a]/40 hover:text-[#e0a63a]"
                    >
                      <FileText className="h-3 w-3" />
                      {source.title?.trim() || `Note #${source.id}`}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg border border-[#242429] bg-[#18181c] px-3.5 py-2.5 text-sm text-[#9a9a9f]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {chatMutation.isError && (
        <p className="px-4 pb-1 text-xs text-[#ff6b6f]">
          {getErrorMessage(chatMutation.error, "Failed to get an answer.")}
        </p>
      )}

      <div className="flex items-end gap-2 border-t border-[#242429] p-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something about your notes..."
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-lg border border-[#242429] bg-[#18181c] px-3 py-2 text-sm text-[#f2f2f0] placeholder:text-[#6b6b70] focus:border-[#e0a63a]/60 focus:outline-none focus:ring-2 focus:ring-[#e0a63a]/20"
        />
        <button
          onClick={handleSend}
          disabled={!question.trim() || chatMutation.isPending}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e0a63a] text-[#131316] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          title="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}