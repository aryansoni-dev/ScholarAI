"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BookOpen,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FILE_TYPE_MAP: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/gif": "GIF",
  "image/webp": "WEBP",
};

const ALLOWED_TYPES = Object.keys(FILE_TYPE_MAP);

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "ready":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-2.5 h-2.5" />Ready
        </Badge>
      );
    case "processing":
      return (
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />Processing
        </Badge>
      );
    case "uploading":
      return (
        <Badge className="bg-secondary/10 text-secondary border-secondary/20 gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />Uploading
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-error/10 text-error border-error/20 gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <AlertCircle className="w-2.5 h-2.5" />Error
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function KnowledgeBasePage() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Id<"documents"> | null>(null);

  const documents = useQuery(
    api.documents.listDocuments,
    user ? { userId: user.id } : "skip"
  );
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const saveDocument = useMutation(api.documents.saveDocument);
  const updateDocumentText = useMutation(api.documents.updateDocumentText);
  const updateStatus = useMutation(api.documents.updateDocumentStatus);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "text/plain") return await file.text();
    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("mimeType", file.type);
      const res = await fetch("/api/extract-text", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        return data.text ?? "";
      }
    }
    return `Document: ${file.name}`;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user || acceptedFiles.length === 0) return;
      for (const file of acceptedFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) { toast.error(`Unsupported file type: ${file.name}`); continue; }
        if (file.size > 50 * 1024 * 1024) { toast.error(`File too large (max 50MB): ${file.name}`); continue; }

        setIsUploading(true);
        setUploadProgress(10);
        try {
          const uploadUrl = await generateUploadUrl();
          setUploadProgress(25);
          const uploadRes = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
          if (!uploadRes.ok) throw new Error("Upload failed");
          const { storageId } = await uploadRes.json();
          setUploadProgress(50);
          const docId = await saveDocument({
            userId: user.id,
            name: file.name,
            type: FILE_TYPE_MAP[file.type] ?? file.type.split("/")[1].toUpperCase(),
            size: file.size,
            storageId,
          });
          setUploadProgress(70);
          const extractedText = await extractTextFromFile(file);
          setUploadProgress(90);
          await updateDocumentText({ documentId: docId, extractedText });
          setUploadProgress(100);
          toast.success(`"${file.name}" uploaded successfully!`);
        } catch (err) {
          console.error(err);
          toast.error(`Failed to upload "${file.name}"`);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    },
    [user, generateUploadUrl, saveDocument, updateDocumentText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: isUploading,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument({ documentId: deleteTarget });
      toast.success("Document deleted.");
    } catch {
      toast.error("Failed to delete document.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = documents?.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const readyCount = documents?.filter((d) => d.status === "ready").length ?? 0;
  const totalSize = documents?.reduce((acc, d) => acc + d.size, 0) ?? 0;

  return (
    <div className="flex flex-col h-full bg-surface text-on-surface">

      {/* ── Header ── */}
      <div className="px-4 py-4 md:px-8 md:py-6 border-b border-white/[0.06] bg-surface-container-low/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">Knowledge Base</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
              {readyCount} docs
            </span>
            <span className="text-xs text-on-surface-variant">{formatBytes(totalSize)} used</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-xs sm:text-sm">
          Upload and manage your study materials. Supports PDF, Word, PowerPoint, images, and text files.
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-4 py-5 md:px-8 md:py-6 gap-5">

        {/* ── Upload Drop Zone ── */}
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-7 sm:p-9 text-center cursor-pointer",
            "transition-all duration-300",
            isDragActive
              ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(160,120,255,0.15)]"
              : "border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.02]",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                isDragActive
                  ? "bg-primary/20 shadow-[0_0_16px_rgba(160,120,255,0.3)]"
                  : "glass-pane"
              )}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <Upload className={cn("w-6 h-6 transition-colors", isDragActive ? "text-primary" : "text-on-surface-variant")} />
              )}
            </div>
            {isUploading ? (
              <div className="w-full max-w-xs">
                <p className="text-sm text-on-surface-variant mb-3">Uploading &amp; processing...</p>
                <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full rounded-full progress-glow transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {isDragActive ? "Drop files here" : "Drag & drop files, or click to browse"}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    PDF, PPT, DOCX, TXT, Images • Max 50MB per file
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-on-surface-variant hover:text-on-surface hover:border-primary/30 transition-all duration-200">
                  <Plus className="w-3.5 h-3.5" /> Choose Files
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="input-glass w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
          />
        </div>

        {/* ── Document List ── */}
        <ScrollArea className="flex-1">
          {!documents ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered!.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
              <div className="w-16 h-16 rounded-2xl glass-pane flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-on-surface-variant/40" />
              </div>
              <p className="text-on-surface-variant text-sm">
                {search ? "No documents match your search." : "No documents yet. Upload your first file above."}
              </p>
            </div>
          ) : (
            <div className="grid gap-2.5">
              {filtered!.map((doc, i) => (
                <div
                  key={doc._id}
                  className="glass-interactive group flex items-center gap-4 px-4 py-3.5 rounded-xl animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* File icon */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-primary/15 group-hover:shadow-[0_0_12px_rgba(160,120,255,0.2)]">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{doc.name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/60">{doc.type}</span>
                      <span className="text-on-surface-variant/30 text-[10px]">•</span>
                      <span className="text-[10px] text-on-surface-variant/60">{formatBytes(doc.size)}</span>
                      <span className="text-on-surface-variant/30 text-[10px] hidden sm:inline">•</span>
                      <span className="text-[10px] text-on-surface-variant/60 hidden sm:inline">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">{getStatusBadge(doc.status)}</div>

                  {/* Delete */}
                  <div className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setDeleteTarget(doc._id)}
                      className="p-1.5 rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="glass-popover border-white/[0.09] text-on-surface max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-on-surface font-semibold">Delete document?</DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              This will permanently delete the file and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-white/[0.08] text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04] rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-error/80 hover:bg-error text-on-error rounded-xl transition-colors"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
