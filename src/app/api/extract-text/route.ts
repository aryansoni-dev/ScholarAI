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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const mimeType = formData.get("mimeType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file data" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Native PDF Extraction (Fast, Free, Highly Accurate)
    if (mimeType === "application/pdf") {
      try {
        // Hide require from Next.js Webpack/Turbopack to prevent static hoisting and DOM polyfill issues
        const pdfParseModule: any = await import("pdf-parse");
        let pdfParseFn = pdfParseModule;
        if (typeof pdfParseFn !== 'function') pdfParseFn = pdfParseModule.default;
        if (typeof pdfParseFn !== 'function') pdfParseFn = pdfParseModule.PDFParse;
        
        if (typeof pdfParseFn !== 'function') {
           throw new Error("Could not resolve pdf-parse function.");
        }
        const data = await pdfParseFn(buffer);
        return NextResponse.json({ text: data.text });
      } catch (err: any) {
        console.error("PDF parse error:", err);
        return NextResponse.json({ text: "", error: "Failed to parse PDF: " + err?.message });
      }
    }

    // 2. AI OCR Extraction for Images
    if (mimeType.startsWith("image/")) {
      const prompt = `Extract all the text content from this image ("${fileName}"). Return only the raw text content.`;
      const base64 = buffer.toString("base64");

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
            ],
          },
        ],
      });

      const text = response.choices[0]?.message?.content || "";
      return NextResponse.json({ text });
    }

    // 3. Raw Text Extraction
    if (mimeType.startsWith("text/")) {
      return NextResponse.json({ text: buffer.toString("utf-8") });
    }

    return NextResponse.json({ text: "", error: "Unsupported file type for extraction" });
  } catch (error: any) {
    console.error("Text extraction error:", error?.message || error);
    return NextResponse.json({ text: "", error: error?.message });
  }
}
