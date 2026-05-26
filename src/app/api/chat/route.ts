import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "ScholarAI",
  }
});

const SYSTEM_PROMPT = `You are ScholarAI, an expert AI study assistant. Your role is to help students understand their study materials deeply.

When given document content, analyze it carefully and provide:
- For Q&A: Accurate, well-explained answers based on the document context
- For summaries: Clear, structured markdown summaries with key takeaways
- For quizzes: Well-formed MCQ questions that test understanding
- For flashcards: Concise question/answer pairs covering key concepts

Always be educational, encouraging, and precise. Format your responses clearly using markdown when appropriate.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...((history || []).slice(-10).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))),
      { role: "user", content: prompt }
    ];

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Fast, free-tier friendly model on OpenRouter
      messages: messages as any,
      max_tokens: 2048,
      temperature: 0.7,
    });

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error: any) {
    console.error("AI API error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
