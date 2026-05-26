import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a short-lived upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save document metadata after upload
export const saveDocument = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      userId: args.userId,
      name: args.name,
      type: args.type,
      size: args.size,
      storageId: args.storageId,
      status: "processing",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update document after text extraction
export const updateDocumentText = mutation({
  args: {
    documentId: v.id("documents"),
    extractedText: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      extractedText: args.extractedText,
      url: args.url,
      status: "ready",
      updatedAt: Date.now(),
    });
  },
});

// Update document status
export const updateDocumentStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.documentId);
    if (!doc) return;
    // Delete from storage
    await ctx.storage.delete(doc.storageId as any);
    // Delete from DB
    await ctx.db.delete(args.documentId);
  },
});

// List documents for a user
export const listDocuments = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single document
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Get file URL from storageId
export const getFileUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
