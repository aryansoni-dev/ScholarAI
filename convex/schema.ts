import {
  defineSchema,
  defineTable,
} from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table synced from Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Knowledge base documents
  documents: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.string(), // "pdf", "ppt", "docx", "image", "txt", etc.
    size: v.number(), // file size in bytes
    storageId: v.string(), // Convex Storage ID
    url: v.optional(v.string()), // public URL once resolved
    extractedText: v.optional(v.string()), // extracted text content for AI
    status: v.string(), // "uploading" | "processing" | "ready" | "error"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  // Chat sessions
  chats: defineTable({
    userId: v.string(),
    documentId: v.optional(v.id("documents")), // the material being discussed
    title: v.string(),
    mode: v.string(), // "qa" | "summarize" | "quiz" | "flashcards"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_document", ["userId", "documentId"]),

  // Chat messages
  messages: defineTable({
    chatId: v.id("chats"),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),
});
