import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new chat session
export const createChat = mutation({
  args: {
    userId: v.string(),
    documentId: v.optional(v.id("documents")),
    title: v.string(),
    mode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chats", {
      userId: args.userId,
      documentId: args.documentId,
      title: args.title,
      mode: args.mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delete a chat and all its messages
export const deleteChat = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
    await ctx.db.delete(args.chatId);
  },
});

// List all chats for a user
export const listChats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single chat
export const getChat = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatId);
  },
});

// Save a message
export const saveMessage = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const msgId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
    // Update chat's updatedAt
    await ctx.db.patch(args.chatId, { updatedAt: Date.now() });
    return msgId;
  },
});

// List messages for a chat
export const listMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});
