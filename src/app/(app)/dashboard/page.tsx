"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Send,
  Bot,
  User,
  BookOpen,
  Sparkles,
  FileText,
  Zap,
  ChevronDown,
  Loader2,
  MessageSquare,
  Copy,
  Check,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "qa" | "summarize" | "quiz" | "flashcards";

const modes: { value: Mode; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "qa",         label: "Q&A",        icon: MessageSquare, desc: "Ask anything about the document" },
  { value: "summarize",  label: "Summarize",   icon: FileText,      desc: "Get a concise summary" },
  { value: "quiz",       label: "Quiz",        icon: Zap,           desc: "Test your knowledge" },
  { value: "flashcards", label: "Flashcards",  icon: BookOpen,      desc: "Generate flashcards" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [selectedDocId, setSelectedDocId] = useState<Id<"documents"> | null>(null);
  const [mode, setMode] = useState<Mode>("qa");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const [docDropOpen, setDocDropOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const documents = useQuery(
    api.documents.listDocuments,
    user ? { userId: user.id } : "skip"
  );
  const createChat = useMutation(api.chats.createChat);
  const saveMessage = useMutation(api.chats.saveMessage);

  const selectedDoc = documents?.find((d) => d._id === selectedDocId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOrCreateChat = async (docId: Id<"documents"> | null, chatMode: Mode) => {
    if (chatId) return chatId;
    const id = await createChat({
      userId: user!.id,
      documentId: docId ?? undefined,
      title: selectedDoc?.name ?? "New Chat",
      mode: chatMode,
    });
    setChatId(id);
    return id;
  };

  const getModePrompt = (userInput: string) => {
    const docContext = selectedDoc?.extractedText
      ? `\n\nDocument content:\n---\n${selectedDoc.extractedText.slice(0, 8000)}\n---`
      : "";
    switch (mode) {
      case "summarize":
        return `Summarize the following document in a clear, structured markdown format with key points, main ideas, and important details.${docContext}`;
      case "quiz":
        return `Generate a multiple-choice quiz with 5 questions based on the document. Format each question clearly with options A, B, C, D and indicate the correct answer.${docContext}`;
      case "flashcards":
        return `Generate 8 study flashcards from the document. Format as:\n**Q:** [question]\n**A:** [answer]\n\nSeparate each card with a blank line.${docContext}`;
      default:
        return `${userInput}${docContext}`;
    }
  };

  const handleSend = async (customInput?: string) => {
    const text = customInput ?? input.trim();
    if (!text && mode === "qa") return;
    if (!user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text || `Generate ${mode}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const currentChatId = await getOrCreateChat(selectedDocId, mode);
      await saveMessage({ chatId: currentChatId, role: "user", content: userMessage.content });

      const prompt = getModePrompt(text || `Generate ${mode} for this document`);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history: messages }),
      });

      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage({ chatId: currentChatId, role: "assistant", content: data.text });
    } catch {
      toast.error("Failed to get AI response. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleModeAction = () => {
    if (!selectedDoc) {
      toast.error("Please select a document from the Knowledge Base first.");
      return;
    }
    handleSend(`Generate ${mode}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewSession = () => {
    setMessages([]);
    setChatId(null);
    setInput("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (text: string) => {
    setInput(text);
    const textarea = document.querySelector("textarea");
    if (textarea) textarea.focus();
  };

  return (
    <div className="flex flex-col h-full bg-surface text-on-surface">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.06] bg-surface-container-low/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-on-surface tracking-tight">Chat</h1>
          {messages.length > 0 && (
            <button
              onClick={startNewSession}
              className="text-xs h-7 px-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200"
            >
              + New
            </button>
          )}
        </div>

        {/* Document Selector */}
        <div className="relative">
          <button
            onClick={() => setDocDropOpen((v) => !v)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs sm:text-sm text-on-surface-variant hover:text-on-surface hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-200"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="max-w-[80px] xs:max-w-[140px] truncate">
              {selectedDoc ? selectedDoc.name : "Select document"}
            </span>
            <ChevronDown className={cn("w-3 h-3 shrink-0 transition-transform duration-200", docDropOpen && "rotate-180")} />
          </button>
          {docDropOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl glass-popover z-50 overflow-hidden animate-fade-up">
              <div className="p-2 text-[10px] text-on-surface-variant font-semibold uppercase tracking-widest px-3 pt-3 pb-1">
                Documents
              </div>
              {!documents || documents.length === 0 ? (
                <p className="px-3 py-3 text-sm text-on-surface-variant">
                  No documents yet. Upload in Knowledge Base.
                </p>
              ) : (
                documents.filter(d => d.status === "ready").map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => { setSelectedDocId(doc._id); setDocDropOpen(false); }}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm transition-all duration-150 hover:bg-white/[0.04]",
                      selectedDocId === doc._id ? "text-primary bg-primary/10" : "text-on-surface-variant"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mode Tabs ── */}
      <div className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 border-b border-white/[0.06] overflow-x-auto scrollbar-none bg-surface-container-lowest/40">
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200",
              mode === value
                ? "bg-primary/15 border border-primary/30 text-primary"
                : "text-on-surface-variant hover:text-on-surface border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03]"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Messages ── */}
      <ScrollArea className="flex-1 min-h-0 px-4 md:px-6">
        <div className="max-w-3xl mx-auto py-6 space-y-6">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl glass-pane flex items-center justify-center mb-5 animate-glow-pulse">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                {selectedDoc ? `Chatting with "${selectedDoc.name}"` : "Start a conversation"}
              </h3>
              <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
                {selectedDoc
                  ? `Use ${modes.find(m => m.value === mode)?.label} to interact with your document.`
                  : "Select a document from the dropdown above, then ask questions or generate study materials."}
              </p>
              {selectedDoc && mode !== "qa" && (
                <button
                  onClick={handleModeAction}
                  className="mt-6 btn-primary-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate {modes.find(m => m.value === mode)?.label}
                </button>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 animate-fade-up",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  msg.role === "user"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-surface-container border border-white/[0.08]"
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-on-surface-variant" />
                )}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]">
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words",
                    msg.role === "user"
                      ? "bg-primary/15 border border-primary/20 text-on-surface rounded-tr-sm"
                      : "bubble-ai text-on-surface rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
                {/* Actions */}
                <div className={cn("flex items-center gap-2 px-1", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </button>
                  )}
                  {msg.role === "user" && (
                    <button
                      onClick={() => handleEdit(msg.content)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3 animate-fade-up">
              <div className="w-8 h-8 rounded-full bg-surface-container border border-white/[0.08] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-on-surface-variant" />
              </div>
              <div className="bubble-ai px-4 py-3 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* ── Input ── */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-white/[0.06] bg-surface-container-low/60 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 rounded-xl input-glass px-3.5 py-2.5 sm:px-4 sm:py-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "qa"
                  ? "Ask a question about the document..."
                  : `Click Generate ${modes.find(m => m.value === mode)?.label} above, or ask anything...`
              }
              className="flex-1 bg-transparent border-0 p-0 resize-none text-on-surface placeholder:text-on-surface-variant/40 focus-visible:ring-0 min-h-[22px] max-h-[160px] text-xs sm:text-sm"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || (!input.trim() && mode === "qa")}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                "btn-primary-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              )}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-on-surface-variant/30 mt-1.5">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
